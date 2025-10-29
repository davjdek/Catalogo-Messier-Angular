import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  protected status: any;

  constructor(private http: HttpClient) {}

  private static formatErrors(error: any) {
    return throwError(error.error);
  }

  getEntita(url: string): Observable<any> {
    return this.http.get(url, {
      observe: 'body',
      responseType: 'json'
    }).pipe(catchError(HttpService.formatErrors));
  }

  updateEntita(data: any, url: string): Observable<any> {
    // Rimuoviamo la gestione manuale degli header
    return this.http.put(url, data).pipe(
      catchError(HttpService.formatErrors)
    );
  }

  deleteEntita(id: number, url: string): Observable<any> {
    return this.http.delete(url + id, {
      observe: 'body',
      responseType: 'json'
    }).pipe(catchError(HttpService.formatErrors));
  }

  insertEntita(body: object, url: string): Observable<any> {
    // Rimuoviamo la gestione manuale degli header
    return this.http.put(url, body).pipe(
      catchError(HttpService.formatErrors)
    );
  }

  postEntita(body: object = {}, url: string): Observable<any> {
    return this.http.post(url, body, {
      observe: 'body',
      responseType: 'json'
    }).pipe(catchError(HttpService.formatErrors));
  }

  deleteMultiple(ids: string[], baseUrl: string): Observable<any[]> {
    const deleteRequests = ids.map(id =>
      this.http.delete(`${baseUrl}${id}`).pipe(
        catchError(error => {
          console.error(`Errore nell'eliminazione dell'id ${id}:`, error);
          // Ritorna un observable vuoto per non interrompere l'intera operazione
          return of(null);
        })
      )
    );
  
    // forkJoin aspetta che tutte le richieste completino e restituisce un array dei risultati
    return forkJoin(deleteRequests);
  }
}