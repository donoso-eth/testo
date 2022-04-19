import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export enum OPERATION_TYPE {
  "CreateStream" = 'Create Stream',
  "StopStream" = 'Stop Stream',
}


@Component({
  selector: 'operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css']
})
export class OperationComponent implements OnInit {
  input_form:FormGroup;
  operations:Array<
  {type: OPERATION_TYPE,  }> = [
    {type:OPERATION_TYPE.CreateStream}];
  operationCtrl = new FormControl();


  constructor(
    public dialogRef: MatDialogRef<OperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.input_form = new FormGroup({
      to: new FormControl('',Validators.required),
      amount: new FormControl(0,[Validators.required, Validators.min(0.01)])
    });

  }
  doTransaction(){
    this.dialogRef.close({...{type:'transaction'},...this.input_form.getRawValue()})

  }

  onNoClick(): void {
    this.dialogRef.close({type:'cancel'});
  }
  ngOnInit(): void {
  }

}
