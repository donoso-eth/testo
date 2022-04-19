import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConstantFlowAgreementV1,
  SuperToken,
} from '@superfluid-finance/sdk-core';
import { DappBaseComponent, DappInjector } from 'angular-web3';
import { Signer, Contract, Wallet } from 'ethers';
import { interval, takeUntil } from 'rxjs';
import { SuperFluidServiceService } from 'src/app/dapp-injector/services/super-fluid/super-fluid-service.service';

import { FakeUser, IFakeUser, ISTREAM_DISPLAY } from '../shared/models/models';

import { abi_ERC20 } from './ERC20_ABI';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent extends DappBaseComponent {
  deployerStream!: ISTREAM_DISPLAY;
  deployer!: Signer;


  deployer_balance!: number;

  eveStream!: ISTREAM_DISPLAY;
  DAPP_STATE: any;
  DAIx!: SuperToken ;


  constructor(
    dapp: DappInjector,
    store: Store,
    private superFluidService: SuperFluidServiceService
  ) {
    super(dapp, store);
  }

  @Input() fake_accounts!: {
    alice: IFakeUser;
    bob: IFakeUser;
    eve: IFakeUser;
  };

  override async hookContractConnected(): Promise<void> {
    this.deployer = this.dapp.signer!;
  
    this.DAIx= await this.superFluidService.sf.loadSuperToken(
      this.superFluidService.superToken
    );




    // const eveStream = await this.getDaiBalance(this.eve.user_address);
    // console.log(eveStream);

    this.eveStream = { balance: 0, streams: [
      { value:3858024691358000, address:this.dapp.signerAddress!},
      { value:-1858024691358000, address:this.fake_accounts.bob.user_address}
    ] };
    console.log(this.eveStream);
  }

  async getAccounFlow(user: FakeUser ) {
    const result = await this.superFluidService.getAccountFlowInfo({
      superToken: this.superFluidService.superToken,
      account: this.fake_accounts[user].user_address,
    });

    console.log(result);
  }

  async stopQuery() {
    this.destroyHooks.next();
  }

  async getFlow(user:FakeUser) {
    const result = await this.superFluidService.getFlow({
      superToken: this.superFluidService.superToken,
      sender: this.dapp.signerAddress!,
      receiver: this.fake_accounts[user].user_address,
    });

    console.log(result);

    // await this.DAIxcontract.transfer(this.eve.user_address, 100)

    // const source = interval(5000);
    // //output: 0,1,2,3,4,5....
    // const subscribe = source
    //   .pipe(takeUntil(this.destroyHooks))
    //   .subscribe(async (val) => {
    //     const eveStream = await this.getDaiBalance(this.eve.user_address);
    //     console.log(eveStream);
    //     this.deployer_balance = await this.getDaiBalance(this.signerAdress);

    //     console.log(this.deployer_balance);
    //   });
  }

  async startStream(sender:FakeUser, receiver:FakeUser, flowRate:number) {
    await this.superFluidService.startStream({
      flowRate: '3858024691358000',
      superToken: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f',
      receiver: this.fake_accounts[receiver].user_address,
      data: '',
    });



    // const source = interval(1000);

    // //output: 0,1,2,3,4,5....
    // const subscribe = source
    //   .pipe(takeUntil(this.destroyHooks))
    //   .subscribe(async (val) => {
    //     const result_2 = await DAIx.realtimeBalanceOf({
    //       providerOrSigner: this.dapp.provider!,
    //       account: this.eve.user_address,
    //     });
    //     console.log(JSON.stringify(result_2));

    //     const result_3 = await DAIx.realtimeBalanceOf({
    //       providerOrSigner: this.dapp.provider!,
    //       account: this.signerAdress,
    //     });
    //     console.log(result_3);
    //   });
  }

  async stopStream(receiver:FakeUser) {
    await this.superFluidService.stopStream({
      sender: this.dapp.signerAddress!,
      superToken: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f',
      receiver: this.fake_accounts[receiver].user_address,
      data: '',
    });
 
  }



  getAllStreamsByAccount(sccount: string) {}
}
