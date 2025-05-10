import {Injectable} from '@angular/core';
import {UserDTO} from '../userDTO.model';
import { JwtService } from './jwt.service';
import {map} from 'rxjs/operators';
import { HttpService } from './app.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
export const AUTH_USER_DATA = 'user-data';

interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

@Injectable({
  providedIn : 'root'
})

export class AuthService implements CanActivate {

  register(newUser: UserDTO) {
    return this.apiService.postEntita(newUser, 'http://catalogo-messier.onrender.com/api/registration/register')
      .pipe(
        map(response => {
          // Se il backend ritorna un token (opzionale), puoi salvarlo qui
          if (response && response.token) {
            this.jwtService.saveToken(response.token);
            this.checkstorage(); // aggiorna lo stato interno
          }
          return response;
        })
      );
  }

//sostituire con proprietà di tipo BehaviorSubject
  public userData : UserDTO | null = null;

  constructor (
    public jwtService: JwtService,
    private apiService: HttpService,
    private http: HttpClient,
  ) {
    this.checkstorage();
  }


  checkstorage() {
    const userData = window.localStorage.getItem(AUTH_USER_DATA);
    if (userData && userData !== 'undefined' && userData !== 'null') {
      try {
        this.userData = JSON.parse(userData);
        console.log("sessione aperta");
      } catch (e) {
        console.error('Errore nel parsing di userData da localStorage:', e);
        this.userData = null;
        // eventualmente pulisci localStorage per evitare errori futuri
        window.localStorage.removeItem(AUTH_USER_DATA);
      }
    } else {
      this.userData = null;
    }
  }

  setAuth(user: UserDTO) {
    this.jwtService.saveToken(user.token);
  }

  login (authData: any){
    return this.apiService.postEntita(authData, 'http://catalogo-messier.onrender.com/api/auth/login')
    .pipe(
      map(response => {
        // Supponiamo che response abbia la forma { token: '...' }
        if (response && response.token) {
          this.jwtService.saveToken(response.token); // salva il token
          console.log('Token salvato tramite JwtService');
          window.localStorage.setItem(AUTH_USER_DATA, JSON.stringify(authData));
        
          this.checkstorage(); // aggiorna eventuale stato interno
          return response;
        } else {
          throw new Error('Token non presente nella risposta');
        }
      })
    );
  }
  
  public isLoggedIn () {
    return (!!this.jwtService.getToken()) && !this.jwtService.isTokenExpired();
  }


  public logout () {
    console.log(this.isLoggedIn());
    if (!(this.isLoggedIn())) {
      return;
    }
    window.localStorage.clear();
    console.log("sessione chiusa");
    this.checkstorage();
  }

  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh() {
    this.refreshSubject.next();
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const loggedIn = this.isLoggedIn();
    console.log('AuthService.canActivate - loggedIn:', loggedIn);
    return loggedIn;
  }

  changePassword(data: ChangePasswordPayload): Observable<any> {
    // Se usi token JWT o altro, aggiungi l'header Authorization
    const token = this.jwtService.getToken(); // o come gestisci il token
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;

    // Effettua la chiamata PATCH o POST all'endpoint cambio password
    return this.http.patch(`http://catalogo-messier.onrender.com/api/auth/cambio-password`, data, { headers });
  }

}
