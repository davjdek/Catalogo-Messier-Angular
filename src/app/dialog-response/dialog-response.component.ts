import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-response',
  templateUrl: './dialog-response.component.html',
  styleUrls: ['./dialog-response.component.css']
})
export class DialogResponseComponent implements OnInit {

  response !: string;

  constructor(
    private dialogRef: MatDialogRef<DialogResponseComponent>,
    @Inject(MAT_DIALOG_DATA) data : any,
  ) {  }

  close(){
    this.dialogRef.close('save')
  }

  ngOnInit(): void {
  }


}
