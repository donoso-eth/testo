import { Component, Inject, OnInit } from '@angular/core';

import { Contract, ethers, Signer, utils, Wallet } from 'ethers';

import {
  BlockWithTransactions,
  IBALANCE,
  convertWeiToEther,
  convertEtherToWei,
  displayEther,
  displayUsd,
  convertUSDtoEther,
  Web3State,
  web3Selectors,
  AngularContract,
  DappBaseComponent,
  DappInjector,
} from 'angular-web3';
import { Store } from '@ngrx/store';
import { first, firstValueFrom } from 'rxjs';
import { DialogService, NotifierService } from '../../dapp-components';
import { FormControl, Validators } from '@angular/forms';
import { SuperFluidServiceService } from 'src/app/dapp-injector/services/super-fluid/super-fluid-service.service';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';

@Component({
  selector: 'super-fluid',
  templateUrl: './super-fluid-demo.component.html',
  styleUrls: ['./super-fluid-demo.component.scss'],
})
export class SuperFluidDemoComponent extends DappBaseComponent implements OnInit {



  contractBalance!: IBALANCE;
  contractHeader!: any;
  deployer_address!: string;
  //  myContract!: ethers.Contract;

  provider!: ethers.providers.JsonRpcProvider;
  //  signer: any;
  deployer_balance: any;
  loading_framework: 'loading' | 'found' | 'error' = 'loading';

  // newWallet!: ethers.Wallet;
  nameCtrl = new FormControl('', Validators.required)
  imageCtrl = new FormControl('', Validators.required)

  dollarExchange!: number;
  balanceDollar!: number;


  fake_accounts!:   { 
   alice: { user: any; user_address: any },
   bob: { user: any; user_address: any };
   eve: { user: any; user_address: any };
}


  private _dollarExchange!: number;

  constructor(
    private superFluidService:SuperFluidServiceService,
    private dialogService: DialogService,
    private notifierService: NotifierService,
   
    dapp: DappInjector,
    store: Store<Web3State>
  ) {
    super(dapp, store);
  }

  async onChainStuff() {
    try {
    
      await this.superFluidService.initializeFramework();
     
      const alice = await this.createBurnerUser('alice');
      const bob = await this.createBurnerUser('bob');
      const eve = await this.createBurnerUser('eve');

      this.fake_accounts = { alice, bob, eve};




      this.loading_framework == 'found'


      this.deployer_address = this.dapp.signerAddress!;

      this.loading_framework = 'found'
    
        // this.defaultContract.instance.on('NewGravatar', (args) => {
        //   let payload;
        //   if (typeof args == 'object') {
        //     payload = JSON.stringify(args);
        //   } else {
        //     payload = args.toString();
        //   }
        //   console.log(payload)
        // });
 

        // this.defaultContract.instance.on('UpdatedGravatar', (args,arg2,arg3,arg4) => {
        //   let payload;
        //   console.log(args,arg2,arg3,arg4)
        //   if (typeof args == 'object') {
        //     payload = JSON.stringify(args);
        //   } else {
        //     payload = args.toString();
        //   }
        //   console.log(payload)
        // });
 


      this.contractHeader = {
        name: this.defaultContract.name,
        address: this.defaultContract.address,
        abi: this.defaultContract.abi,
        network: '',
      };
    } catch (error) {
      console.log(error);
      this.loading_framework = 'error';
    }
  }

  async createBurnerUser(name:string) {

    let wallet: Wallet;
    const currentPrivateKey = window.localStorage.getItem(name + 'metaPrivateKey');
    if (currentPrivateKey) {
      wallet = new Wallet(currentPrivateKey);
    } else {
      wallet = Wallet.createRandom();
      const privateKey = wallet._signingKey().privateKey;
      window.localStorage.setItem(name + 'metaPrivateKey', privateKey);
    }
    const user = await wallet.connect(this.dapp.provider!);
    const user_address = await user.getAddress();
    return { user, user_address };
  }



  async createGravatar() {
    if (this.nameCtrl.invalid){
      alert("please input name")
      return
    }
    const name = this.imageCtrl.value;


    if (this.imageCtrl.invalid){
      alert("please input image")
      return
    }
    const image = this.imageCtrl.value;





  }



  async doFaucet() {
    this.blockchain_is_busy = true;
    let amountInEther = '0.1';
    // Create a transaction object

    let tx = {
      to: await this.dapp.signerAddress,
      // Convert currency unit from ether to wei
      value: ethers.utils.parseEther(amountInEther),
    };

    const deployer = await this.defaultProvider.getSigner();

    // Send a transaction
    // const transaction_result = await this.dapp.doTransaction(tx, deployer);
    // this.blockchain_is_busy = false;
    // await this.notifierService.showNotificationTransaction(transaction_result);
  }

  async openTransaction() {
    //  console.log(await this.getDollarEther());
    this.blockchain_is_busy = true;
    const res = await this.dialogService.openTransaction();

    if (res && res.type == 'transaction') {
      const usd = res.amount;
      //  const amountInEther = convertUSDtoEther(res.amount, await this.getDollarEther());
      const amountinWei = 0; //convertEtherToWei(amountInEther);

      let tx = {
        to: res.to,
        // Convert currency unit from ether to wei
        value: amountinWei,
      };

      // const transaction_result = await this.dapp.doTransaction(tx);
      // this.blockchain_is_busy = false;
      // await this.notifierService.showNotificationTransaction(
      //   transaction_result
      // );
    } else {
      this.blockchain_is_busy = false;
    }
  }



  override async hookChainIsLoading() {
    console.log('is loading');
  }




  ngOnInit(): void {}

  override async hookFailedtoConnectNetwork(): Promise<void> {
    console.log('Failed to Connect');
  }

  override async hookContractConnected(): Promise<void> {
    console.log('CONNECTED COMPONENT');
    this.onChainStuff();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    console.log('AFTER View init Component');
  }
}
