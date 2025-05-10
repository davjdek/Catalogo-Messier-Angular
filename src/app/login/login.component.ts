import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/authService';
import { UserDTO } from '../userDTO.model';
import { JwtService } from '../services/jwt.service';
import { CambioPasswordComponent } from '../cambio-password/cambio-password.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';   // <-- importa Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username!: string;
  public email!: string;
  public password!: string;

  constructor(
    public authService: AuthService,
    private jwtService: JwtService,
    private dialog: MatDialog,
    private router: Router          // <-- inietta Router
  ) { }

  ngOnInit(): void {
  }

  login() {
    if (this.username && this.password) {
      const usr = new UserDTO();
      usr.username = this.username;
      usr.password = this.password;

      this.authService.login(usr).subscribe({
        next: (response: any) => {
          console.log('Risposta login:', response);
          if (response && response.token) {
            this.authService.triggerRefresh();
            // Redirect all'homepage dopo login riuscito
            this.router.navigate(['/']);
          } else {
            alert("Errore durante il login");
            console.error('Token non presente nella risposta');
          }
        },
        error: (err) => {
          alert("Credenziali non valide");
          console.error('Errore durante il login', err);
        }
      });

    } else {
      alert("Inserire nome utente e password");
    }

    return;
  }

  onLoginSuccess() {
    this.authService.triggerRefresh();
  }

  cambiaPassword() {
    this.dialog.open(CambioPasswordComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        console.log('Password cambiata con successo, dialog chiuso con save');
      }
    });
  }

  user() {
    return this.authService.userData?.username;
  }
}
