import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/authService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.css']
})
export class CambioPasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CambioPasswordComponent>
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // Getter con tipo AbstractControl | null
  get oldPassword(): AbstractControl | null {
    return this.changePasswordForm.get('old_password');
  }
  
  get newPassword(): AbstractControl | null {
    return this.changePasswordForm.get('new_password');
  }
  
  get confirmPassword(): AbstractControl | null {
    return this.changePasswordForm.get('confirm_password');
  }
  
  get passwordMismatch(): boolean {
    return this.changePasswordForm?.hasError('mismatch') ?? false;
  }

  // Validatore con controllo null-safe
  passwordMatchValidator(form: FormGroup) {
    const newPass = form.get('new_password')?.value;
    const confirmPass = form.get('confirm_password')?.value;
    if (newPass == null || confirmPass == null) {
      return null; // Non validare se uno dei due è null o undefined
    }
    return newPass === confirmPass ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const { old_password, new_password } = this.changePasswordForm.value;

    this.authService.changePassword({ old_password, new_password }).subscribe({
      next: () => {
        this.snackBar.open('Password cambiata con successo', 'Chiudi', { duration: 3000 });
        this.dialogRef.close('save');
        this.changePasswordForm.reset();
      },
      error: (err: { message: string; }) => {
        this.snackBar.open('Errore durante il cambio password: ' + err.message, 'Chiudi', { duration: 5000 });
      }
    });
  }
}
