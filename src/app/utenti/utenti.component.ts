import { Component, ViewChild } from '@angular/core';
import {HttpService} from '../services/app.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import moment from 'moment';
import {DialogUtenteComponent} from '../dialog-utente/dialog-utente.component';
import {DialogConfirmDeleteComponent} from '../dialog-confirm-delete/dialog-confirm-delete.component';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.css']
})
export class UtentiComponent {
  private title = 'app-utenti';
  private utenti: any;
  protected displayedColumns: string[]=['nome','cognome','attivo','username','email','edit','delete','bulkdelete' ];
  protected dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(protected http: HttpService, private dialog: MatDialog, public jwtService: JwtService) { }

  ngOnInit() {
    this.http.getEntita('http://catalogo-messier.onrender.com/api/entita/utenti').subscribe(
      {
        next: (response) => {
          this.utenti = response;
          this.dataSource = new MatTableDataSource(this.utenti);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort= this.sort;
        },
        error: (error) => { console.log(error); }
      }
    );

  }

  applyFilter(event : Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  getUtenti(){
    this.http.getEntita('http://catalogo-messier.onrender.com/api/entita/utenti').subscribe(
      {
        next: (response) => {
          this.utenti = response;
          this.dataSource = new MatTableDataSource(this.utenti);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort= this.sort;

        },
        error: (error) => { console.log(error); }
      }
    );
  }

  addUtente() {
    this.dialog.open(DialogUtenteComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{if (val==='save') {this.getUtenti();}});
  }


  deleteUtente(id : number){
    this.dialog.open(DialogConfirmDeleteComponent, {
      data: {headerText : "l'Utente"}
    })
      .afterClosed().subscribe( val => {
      if (val === 'delete') {
        this.http.deleteEntita(id,'http://catalogo-messier.onrender.com/api/entita/utenti/').subscribe(()=>{this.getUtenti()});

      }
    });
  }

  editUtente(row : any){
    this.dialog.open(DialogUtenteComponent,{
      width: '30%',
      data: row
    }).afterClosed().subscribe(val=>{if (val==='save') {this.getUtenti()}});
  }

  bulkDelete(){
    
    var toBeDeleted = this.dataSource.data.filter(source => source.isDeleted=== true);
    var toBeDeletedCodes = toBeDeleted.map(customer => customer.id);
    console.log(toBeDeletedCodes);
    this.http.deleteMultiple(toBeDeletedCodes,'http://catalogo-messier.onrender.com/api/entita/utenti/').subscribe({
      next: () => this.getUtenti(),
      error: (err: any) => console.error('Errore durante l\'eliminazione', err)
    });
    
  }

  formatDate(date : Date) : String {
    if (date){
      return moment(date).format('DD-MM-YYYY')
    }
    return ''
  }

}
