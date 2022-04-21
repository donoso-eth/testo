import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperFluidDemoComponent } from './super-fluid-demo/super-fluid-demo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

import {AddressShowModule, BlockchainModule, ContractShowModule, DappLoadingModule, DialogModule, HomeModule, NotifierModule, WalletDisplayModule} from '../dapp-components'


import { ICONTRACT_METADATA } from 'angular-web3';

import SuperFluidMetadata from '../../assets/contracts/super_app_metadata.json';
import { StreamComponent } from './stream/stream.component';
import { IdaComponent } from './ida/ida.component';
import { SuperAppComponent } from './super-app/super-app.component';
import { SuperFluidServiceModule } from '../dapp-injector/services/super-fluid/super-fluid-service.module';
import { StreamDisplayModule } from './shared/components/stream-display/stream-display.module';
import { MatTooltipModule } from '@angular/material/tooltip';

export const contractMetadata = new InjectionToken<ICONTRACT_METADATA>('contractMetadata')

export const contractProvider= {provide: 'contractMetadata', useValue:SuperFluidMetadata };



@NgModule({
  declarations: [
    SuperFluidDemoComponent,
    StreamComponent,
    IdaComponent,
    SuperAppComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    BlockchainModule,
    WalletDisplayModule,
    AddressShowModule,
    HomeModule,
    DialogModule,
    NotifierModule,
    DappLoadingModule, 
    SuperFluidServiceModule,

    StreamDisplayModule,

  ],
  exports: [
    SuperFluidDemoComponent
  ],
  providers: [contractProvider]
})
export class SuperFluidDemoModule { }
