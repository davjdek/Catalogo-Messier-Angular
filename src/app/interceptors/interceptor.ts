import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { JwtService } from '../services/jwt.service'; // Assicurati che questo servizio abbia getToken()
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router, private jwtService: JwtService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Recupera il token JWT dal servizio
    const token = this.jwtService.getToken();
    console.log('Interceptor - token:', token);
    // Se il token esiste, clona la richiesta aggiungendo l'header Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Passa la richiesta modificata (o originale se non c'è token) al prossimo handler
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
        }
        return throwError(() => error);
      })
    );;
  }
}