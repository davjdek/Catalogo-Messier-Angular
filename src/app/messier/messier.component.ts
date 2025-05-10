import { Component, ViewChild } from '@angular/core';
import {HttpService} from '../services/app.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import {DialogMessierComponent} from '../dialog-messier/dialog-messier.component';
import * as _moment from 'moment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DialogConfirmDeleteComponent} from '../dialog-confirm-delete/dialog-confirm-delete.component';
import { Router } from '@angular/router';

const moment = _moment;

@Component({
  selector: 'app-messier',
  templateUrl: './messier.component.html',
  styleUrls: ['./messier.component.css']
})
export class MessierComponent {
  private title = 'app-messier';
  private messier: any;
  protected displayedColumns: string[]=['sigla','url','catalogoNgc','nomeComune','distanza','tipoOggetto','magnitudo','costellazione','edit','delete' ];
  protected dataSource !: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(protected http: HttpService, private dialog: MatDialog, private router: Router) {
    }

    getMessier(){
      this.http.getEntita('https://catalogo-messier.onrender.com/api/entita/messier').subscribe(
        {
          next: (response) => {
            this.messier = response;
            this.dataSource = new MatTableDataSource(this.messier);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort= this.sort;

          },
          error: (error) => { console.log(error); }
        }
      );
    }

  ngOnInit() {
    this.getMessier()
  }

  applyFilter(event : Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  addMessier() {
    this.dialog.open(DialogMessierComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{if (val==='save') {this.getMessier(); }});
  }

  deleteMessier(id : number){
    this.dialog.open(DialogConfirmDeleteComponent, {
      data: {headerText : 'Oggetto'}
    })
      .afterClosed().subscribe( val => {
      if (val === 'delete') {
        this.http.deleteEntita(id, 'https://catalogo-messier.onrender.com/api/entita/messier/').subscribe(()=>{this.getMessier()});

      }
    });
  }

  editMessier(row : any){
    let config = new MatDialogConfig();
    this.dialog.open(DialogMessierComponent,{
      width: '30%',
      data: row
    }).afterClosed().subscribe(val=>{if (val==='save') {this.getMessier(); }});
  }

  goToDetail(row: any) {
    console.log('goToDetail called', row);
  this.router.navigate(['/messier', row.sigla], { state: { messier: row } });
  }

  formatDate(date : Date) : String {
    if (date){
      return moment(date).format('DD-MM-YYYY')
    }
    return ''
  }
}
