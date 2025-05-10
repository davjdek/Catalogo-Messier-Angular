import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../services/app.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DialogResponseComponent} from '../dialog-response/dialog-response.component';

@Component({
  selector: 'app-dialog-messier',
  templateUrl: './dialog-messier.component.html',
  styleUrls: ['./dialog-messier.component.css']
})
export class DialogMessierComponent implements OnInit {
  protected productForm !: FormGroup;
  protected tipoStatus !: Array<string>;
  protected actionBtn : string = 'Save';
  protected headerText: string = 'Aggiungi nuovo oggetto Messier';
  tipoOggettoList: string[] = [];  // assegno l’array a una proprietà

 
  constructor(private formBuilder : FormBuilder,
              private http : HttpService,
              private dialogRef : MatDialogRef<DialogMessierComponent>,
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
    this.productForm = this.formBuilder.group({
      sigla : ['', Validators.required],
      url : ['', Validators.required],
      catalogoNgc : ['', Validators.required],
      nomeComune : ['', Validators.required],
      distanza : ['', Validators.required],
      tipoOggetto : ['', Validators.required],
      magnitudo : ['', Validators.required],
      costellazione : ['', Validators.required],
      foto : ['', Validators.required],
      descrizione : ['', Validators.required],
    })
    this.getTipoOggetto()

    if (this.editdata){
      this.actionBtn = "Update";
      this.headerText = "Aggiorna Messier";
      this.productForm.controls['sigla'].setValue(this.editdata.sigla);
      this.productForm.controls['url'].setValue(this.editdata.url);
      this.productForm.controls['catalogoNgc'].setValue(this.editdata.catalogoNgc);
      this.productForm.controls['nomeComune'].setValue(this.editdata.nomeComune);
      this.productForm.controls['distanza'].setValue(this.editdata.distanza);
      this.productForm.controls['tipoOggetto'].setValue(this.editdata.tipoOggetto);
      this.productForm.controls['magnitudo'].setValue(this.editdata.magnitudo);
      this.productForm.controls['costellazione'].setValue(this.editdata.costellazione);
      this.productForm.controls['foto'].setValue(this.editdata.foto);
      this.productForm.controls['descrizione'].setValue(this.editdata.descrizione);
    }
  }
  addMessier(){
    this.productForm.markAllAsTouched();
    this.productForm.updateValueAndValidity();
    if (!this.editdata){
      if(!this.productForm.invalid){
        this.http.insertEntita(this.productForm.value,'https://catalogo-messier.onrender.com/api/entita/messier')
          .subscribe({
            next:(res)=>{
              this.openDialogResponse("Oggetto Messier aggiunto con successo");
              this.productForm.reset();
              this.dialogRef.close('save')
            },
            error:() =>{
              alert("Si è verificato un problema nell'inserimento dell'oggetto")
            }
          })
      }
    }
    else {
     this.updateMessier();
    }
  }

  updateMessier() {
    if (!this.productForm.invalid) {
      let data: any = this.productForm.value;
      data.id = this.editdata.id;
  
      this.http.updateEntita(data, 'https://catalogo-messier.onrender.com/api/entita/messier')
        .subscribe({
          next: (res: any) => {
            this.openDialogResponse("Oggetto aggiornato con successo");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            console.log('Errore ricevuto:', err);
            alert(err.message);
          }
        });
    }
  }

  getTipoOggetto(){
    this.http.getEntita('https://catalogo-messier.onrender.com/api/tipo_status').subscribe({
      next: (res)=>{
        this.tipoOggettoList = Object.values(res);
        console.log (this.tipoOggettoList);},
      error: (error) => {console.log (error)}
    })
  }

  getErrorMessage(control : string) : string {
    if (this.productForm.controls[control].hasError('required'))
    {
      return 'You must enter a value'
    }
    if (this.productForm.controls[control].hasError('email'))
    {
      return 'You must enter a valid email'
    }
    return 'error'
  }
}
