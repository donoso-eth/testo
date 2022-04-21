import { Injectable } from '@angular/core';
import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { OperationComponent } from './operation/operation.component';
import { SuperAppDialogComponent } from './super-app/super-app.component';

import { TransactionComponent } from './transaction/transaction.component';
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog) {}
  async openTransaction() {
    const dialogRef = this.dialog.open(TransactionComponent, {
        width: '80%',
       maxWidth: '400px',
      //   data: {},
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result;
  }

  async openOperation(options:{dispatcher:any,accounts:any, action:any}) {
    const dialogRef = this.dialog.open(OperationComponent, {
        width: '80%',
         maxWidth: '300px',
        data: { accounts:options.accounts, dispatcher:options.dispatcher, action:options.action},
    });
    const result = await firstValueFrom(dialogRef.afterClosed());

    return result;
  }


  async openSuperappStream(options:{dispatcher:any,superAppAddress:string}) {
    const dialogRef = this.dialog.open(SuperAppDialogComponent, {
        width: '80%',
         maxWidth: '300px',
        data: {  dispatcher:options.dispatcher, superAppAddress:options.superAppAddress},
    });
    const result = await firstValueFrom(dialogRef.afterClosed());

    return result;
  }


}
