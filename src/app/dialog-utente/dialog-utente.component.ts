import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../services/app.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog} from '@angular/material/dialog';
import {DialogResponseComponent} from '../dialog-response/dialog-response.component';

@Component({
  selector: 'app-dialog-utente',
  templateUrl: './dialog-utente.component.html',
  styleUrls: ['./dialog-utente.component.css']
})
export class DialogUtenteComponent implements OnInit {
  protected utenteForm !: FormGroup;
  protected actionBtn : string = 'Save';
  protected headerText: string ='Aggiungi nuovo Utente';
  protected hide = true;
  protected isHidden = "visible";
  protected isEditMode = false;

  constructor(private formBuilder : FormBuilder,
              private http : HttpService,
              private dialogRef : MatDialogRef<DialogUtenteComponent>,
              @Inject(MAT_DIALOG_DATA) public editdata: any,
              private dialog: MatDialog
  ) { }

  openDialogResponse(response: string) {
    const dialogConfig = new MatDialogConfig();
    let dialogRefResponse : MatDialogRef<DialogResponseComponent>;
    dialogConfig.width = '30%';

    dialogRefResponse = this.dialog.open(DialogResponseComponent, dialogConfig);
    dialogRefResponse.componentInstance.response = response;
    dialogRefResponse.afterClosed().subscribe(val=>{if (val==='save') {this.dialogRef.close()}})
  }

  ngOnInit(): void {
    this.isEditMode = !!this.editdata;
    
    // Crea il form base con campi comuni
    this.utenteForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      attivo: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Imposta password con validazione condizionale
      password: ['', this.isEditMode ? [] : Validators.required]
    });

    if (this.isEditMode) {
      // Modalità aggiornamento
      this.actionBtn = "Update";
      this.isHidden = "hidden";
      this.headerText = "Aggiorna Utente";
      
      // Popola il form con i dati esistenti
      this.utenteForm.patchValue({
        nome: this.editdata.nome || '',
        cognome: this.editdata.cognome || '',
        attivo: this.editdata.attivo || '',
        username: this.editdata.username || '',
        email: this.editdata.email || '',
        password: '' // Campo password vuoto per l'aggiornamento
      });
    } else {
      // Modalità creazione
      this.actionBtn = "Save";
      this.isHidden = "visible";
      this.headerText = "Aggiungi nuovo Utente";
    }

    // Debug stato form e controlli
    setTimeout(() => {
      console.log('Stato form:', this.utenteForm.status);
      Object.keys(this.utenteForm.controls).forEach(key => {
        const control = this.utenteForm.get(key);
        console.log(`${key}: valid=${control?.valid}, errors=`, control?.errors, ', value=', control?.value);
      });
    }, 0);
  }

  addUtente(){
    this.utenteForm.markAllAsTouched();
    
    if (!this.isEditMode) {
      // Modalità creazione
      if (!this.utenteForm.invalid) {
        this.http.insertEntita(this.utenteForm.value, 'https://catalogo-messier.onrender.com/api/entita/utenti')
          .subscribe({
            next:(res)=>{
              this.openDialogResponse("Utente aggiunto con successo");
              this.utenteForm.reset();
              this.dialogRef.close('save')
            },
            error:(err) =>{
              alert ("Si è verificato un problema nell'inserimento dell'Utente");
              console.error(err);
            }
          });
      } else {
        console.error('Form non valido:', this.utenteForm);
      }
    } else {
      this.updateUtente();
    }
  }

  updateUtente(){
    // Per l'aggiornamento, controlla se il form è valido escludendo la password vuota
    const formValid = this.isFormValidForUpdate();
    
    if (formValid) {
      let data: any = {...this.utenteForm.value};
      data.id = this.editdata.id;
      
      // Se la password è vuota, rimuovila dall'oggetto per non aggiornare il campo
      if (!data.password) {
        delete data.password;
      }
      
      this.http.updateEntita(data, 'https://catalogo-messier.onrender.com/api/entita/utenti')
        .subscribe({
          next: (res)=>{
            this.openDialogResponse("Utente aggiornato con successo");
            this.utenteForm.reset();
            this.dialogRef.close('save')
          },
          error: (err)=>{
            alert ("Si è verificato un problema nell'aggiornamento dell'Utente");
            console.error(err);
          }
        });
    } else {
      console.error('Form non valido per update:', this.utenteForm);
    }
  }

  // Metodo ausiliario per verificare la validità del form in modalità update
  isFormValidForUpdate(): boolean {
    // Controlla se tutti i campi sono validi eccetto password
    const allFieldsExceptPassword = Object.keys(this.utenteForm.controls)
      .filter(key => key !== 'password')
      .every(key => !this.utenteForm.controls[key].invalid);
    
    // La password è opzionale nell'update, quindi è valida se è vuota o se passa la validazione
    const passwordControl = this.utenteForm.get('password');
    const passwordValid = !passwordControl?.value || !passwordControl?.invalid;
    
    return allFieldsExceptPassword && passwordValid;
  }

  getErrorMessage(control : string) : string {
    if (this.utenteForm.controls[control].hasError('required'))
    {
      return 'You must enter a value'
    }
    if (this.utenteForm.controls[control].hasError('email'))
    {
      return 'You must enter a valid email'
    }
    return 'error'
  }
}