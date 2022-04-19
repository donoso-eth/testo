import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from './dialog.service';
import { TransactionComponent } from './transaction/transaction.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OperationComponent } from './operation/operation.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    TransactionComponent,
    OperationComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule
  ],
 
})
export class DialogModule {
  static forRoot(): ModuleWithProviders<DialogModule> {
    return {
      ngModule: DialogModule,
      providers: [
        {provide: DialogService}
      ]
    };
  }
 }
