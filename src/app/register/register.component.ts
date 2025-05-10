import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/authService';
import { UserDTO } from '../userDTO.model';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public nome!: string;
  public cognome!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public confirmPassword!: string;

  constructor(public authService: AuthService, private router: Router, private jwtService: JwtService) { }

  ngOnInit(): void { }

  register() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      console.error('Tutti i campi sono obbligatori');
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.error('Le password non coincidono');
      return;
    }

    const newUser = new UserDTO();
    newUser.nome = this.nome;
    newUser.cognome = this.cognome;
    newUser.username = this.username;
    newUser.email = this.email;
    newUser.password = this.password;

    this.authService.register(newUser).subscribe({
      next: (response: any) => {
        console.log('Registrazione avvenuta con successo:', response);
        console.log(newUser);
        if (response && response.token) {
          // Salva il token JWT
          this.jwtService.saveToken(response.token);

          // Aggiorna lo stato utente e permessi
          this.authService.triggerRefresh();

          // Redirect all'homepage
          this.router.navigate(['/']);
        } else {
          console.error('Token non presente nella risposta');
        }
      },
      error: (err: any) => {
        console.error('Errore durante la registrazione:', err);
      }
    });
  }
}
