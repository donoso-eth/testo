import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STREAM_ACTION } from 'src/app/6-super-fluid/shared/models/models';

export enum OPERATION_TYPE {
  'CreateStream' = 'Create Stream',
  'StopStream' = 'Stop Stream',
}

@Component({
  selector: 'operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css'],
})
export class OperationComponent implements OnInit {
  input_form: FormGroup;
  operations: Array<{ type: OPERATION_TYPE }> = [
    { type: OPERATION_TYPE.CreateStream },
  ];
  operationCtrl = new FormControl();

  actionCtrl = new FormControl(0);
  actions = [
    { name: STREAM_ACTION.CREATE, value: 0 },
    { name: STREAM_ACTION.UPDATE, value: 1 },
    { name: STREAM_ACTION.DELETE, value: 2 },
  ];
  users: any;
  flowRatePerSecond = '0';
  dispatcher: any;
  constructor(
    public dialogRef: MatDialogRef<OperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef
  ) {
    this.input_form = new FormGroup({
      toCtrl: new FormControl('', Validators.required),
      amountCtrl: new FormControl(10, [
        Validators.required,
        Validators.min(0.01),
      ]),
    });

    this.input_form.controls.amountCtrl.valueChanges.subscribe((val) => {
      this.flowRatePerSecond = ((val * 10 ** 18) / (30 * 24 * 60 * 60)).toFixed(0);
    });

    console.log(data);

    this.dispatcher = this.data.dispatcher;

    this.users = Object.keys(this.data.accounts).filter(
      (key) => key !== this.data.dispatcher
    );
    this.input_form.controls.toCtrl.setValue(this.users[0]);
  }
  doTransaction() {
    const result = {
      flowRate: this.flowRatePerSecond,
      to: this.input_form.controls.toCtrl.value,
      action: this.actions[this.actionCtrl.value].name,
    };

    this.dialogRef.close(result);
  }

  onNoClick(): void {
    this.dialogRef.close({ type: 'cancel' });
  }
  ngOnInit(): void {}
}
