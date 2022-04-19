import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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


  actionCtrl = new FormControl(0)
  actions = [{ name:"Create Stream", value:0},{ name:"Update Stream", value:1},{ name:"Delete Stream", value:2}]
  users:any;
  flowRatePerSecond = 0;
  constructor(
    public dialogRef: MatDialogRef<OperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd:ChangeDetectorRef
  ) {

    this.input_form = new FormGroup({
      toCtrl: new FormControl('',Validators.required),
      amountCtrl: new FormControl(0,[Validators.required, Validators.min(0.01)]),
  
    });

    this.input_form.controls.amountCtrl.valueChanges.subscribe(val=> {
      this.flowRatePerSecond = (val * 10 ** 18)/(30 * 24 * 60 * 60)
    })

    console.log(data)
    this.users = Object.keys(this.data.accounts).filter(key=> key !== this.data.dispatcher)
    this.input_form.controls.toCtrl.setValue(this.users[0])
  
    console.log(this.users)

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
