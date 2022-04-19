import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SuperFluidDemoModule } from './6-super-fluid/super-fluid-demo.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DappInjectorModule } from './dapp-injector/dapp-injector.module';
import { StoreModule } from '@ngrx/store';
import { we3ReducerFunction } from 'angular-web3';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SuperFluidDemoModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({web3: we3ReducerFunction}),
    DappInjectorModule.forRoot({wallet:'local', defaultNetwork:'localhost'}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
