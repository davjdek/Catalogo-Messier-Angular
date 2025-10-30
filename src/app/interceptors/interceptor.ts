import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router, private jwtService: JwtService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // ⬇️ AGGIUNGI QUESTO CHECK: Escludi il backend del chatbot dall'interceptor
    if (request.url.includes('deepthought-4ywi.onrender.com')) {
      console.log('Interceptor - Skipping token for chatbot API');
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            // gestisci errore 403 se necessario
          }
          return throwError(() => error);
        })
      );
    }
    
    // Per tutte le altre richieste, aggiungi il token come al solito
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
          // gestisci errore 403 se necessario
        }
        return throwError(() => error);
      })
    );
  }
}