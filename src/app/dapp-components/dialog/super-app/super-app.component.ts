import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STREAM_ACTION } from 'src/app/6-super-fluid/shared/models/models';

export enum OPERATION_TYPE {
  'CreateStream' = 'Create Stream',
  'StopStream' = 'Stop Stream',
}

@Component({
  selector: 'super-app',
  templateUrl: './super-app.component.html',
  styleUrls: ['./super-app.component.css'],
})
export class SuperAppDialogComponent implements OnInit {
  input_form: FormGroup;


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
    public dialogRef: MatDialogRef<SuperAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef
  ) {
    this.input_form = new FormGroup({
      amountCtrl: new FormControl(0, [
        Validators.required,
        Validators.min(0.01),
      ]),
    });

    this.input_form.controls.amountCtrl.valueChanges.subscribe((val) => {
      this.flowRatePerSecond = ((val * 10 ** 18) / (30 * 24 * 60 * 60)).toFixed(0);
    });

    console.log(data);

    this.dispatcher = this.data.dispatcher;
    this.input_form.controls.amountCtrl.setValue(10)

  }
  doTransaction() {
    const result = {
      flowRate: this.flowRatePerSecond,
      to: this.data.superAppAddress,
      action: this.actions[this.actionCtrl.value].name,
    };

    this.dialogRef.close(result);
  }

  onNoClick(): void {
    this.dialogRef.close({ type: 'cancel' });
  }
  ngOnInit(): void {}
}
