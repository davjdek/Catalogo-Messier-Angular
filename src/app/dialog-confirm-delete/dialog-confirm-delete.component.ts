import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-response',
  templateUrl: './dialog-confirm-delete.component.html',
  styleUrls: ['./dialog-confirm-delete.component.css']
})
export class DialogConfirmDeleteComponent implements OnInit {

  protected headerText !: string;

  constructor(
    private dialogRef: MatDialogRef<DialogConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) data : any,
  ) { this.headerText = data.headerText }

  annulla(){
    this.dialogRef.close('cancel')
  }

  delete(){
    this.dialogRef.close('delete')
  }

  ngOnInit(): void {
  }


}
