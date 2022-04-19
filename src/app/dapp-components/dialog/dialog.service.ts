import { Injectable } from '@angular/core';
import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { OperationComponent } from './operation/operation.component';

import { TransactionComponent } from './transaction/transaction.component';
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog) {}
  async openTransaction() {
    const dialogRef = this.dialog.open(TransactionComponent, {
      //   width: '80%',
      //   maxWidth: '400px',
      //   data: {},
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result;
  }

  async openOperation() {
    const dialogRef = this.dialog.open(OperationComponent, {
      //   width: '80%',
      //   maxWidth: '400px',
      //   data: {},
    });
    const result = await firstValueFrom(dialogRef.afterClosed());

    return result;
  }
}
