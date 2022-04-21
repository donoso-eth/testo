import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { abi_ERC20 } from 'hardhat/reference/ERC20_ABI';

import { DialogService } from 'src/app/dapp-components';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { SuperFluidServiceService } from 'src/app/dapp-injector/services/super-fluid/super-fluid-service.service';
import { ISTREAM_DISPLAY, IFakeUser, FakeUser } from '../shared/models/models';

@Component({
  selector: 'app-ida',
  templateUrl: './ida.component.html',
  styleUrls: ['./ida.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IdaComponent extends DappBaseComponent  {

  aliceStream: ISTREAM_DISPLAY = { balanceDAI: 0, balanceDAIx: 0, indexs: [] };
  bobStream: ISTREAM_DISPLAY = { balanceDAI: 0, balanceDAIx: 0, indexs: [] };
  eveStream: ISTREAM_DISPLAY = { balanceDAI: 0, balanceDAIx: 0, indexs: [] };

  aliceBalance = '0';
  bobBalance = '0';
  eveBalance = '0';

  DAI!: Contract;

  constructor( dapp: DappInjector,
    store: Store,
    private superFluidService: SuperFluidServiceService,
    private dialog: DialogService) { 
      super(dapp, store);
    }

  @Input() fake_accounts!: {
    alice: IFakeUser;
    bob: IFakeUser;
    eve: IFakeUser;
  };

  override async hookContractConnected(): Promise<void> {
  
    this.DAI = new Contract(
      '0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7',
      abi_ERC20,
      this.signer
    );

    const daiBalance = await this.DAI.balanceOf(this.signerAdress);
    console.log((daiBalance / 10 ** 18).toString());


    this.refreshBalances();
  }


//////// INDEX ///////
async  createIndex(user:FakeUser){
  const id = await this.superFluidService.createIndex()
  let signer = this.fake_accounts[user].user;
  console.log(id);
  const tx = await this.superFluidService.executeLastOperation(signer)
  console.log(tx)

  if (user == 'bob') {
    this.bobStream.indexs?.push({id:id!})
  } else if (user == 'alice') {
    this.aliceStream.indexs?.push({id:id!})
  } else if (user == 'eve') {
    this.eveStream.indexs?.push({id:id!})
  }
}

async addSubscribersToIndex(){

  let config:{ id:string, subscriber:string, shares:string}

  //const result = await this.superFluidService.updateIndex({id:config.id,shares:config.shares, subscriber:config.subscriber})



}


  async fundBurnerUsers() {
    ////// FUNDING WITH ETHER THE BURNER ADDRESS
    const alice = this.fake_accounts.alice;
    await doSignerTransaction(
      this.dapp.signer?.sendTransaction({
        to: alice.user_address,
        value: utils.parseEther('10'),
      })!
    );

    const bob = this.fake_accounts.bob;
    await doSignerTransaction(
      this.dapp.signer?.sendTransaction({
        to: bob.user_address,
        value: utils.parseEther('10'),
      })!
    );

    const eve = this.fake_accounts.eve;
    await doSignerTransaction(
      this.dapp.signer?.sendTransaction({
        to: eve.user_address,
        value: utils.parseEther('10'),
      })!
    );

    this.refreshBalances();
  }

  async downgrade(user: FakeUser) {
    console.log('user');
    const upgrader = this.fake_accounts[user].user;
    //let userDaix = this.DAI

    this.superFluidService.createUpgradeOperation(
      utils.parseEther('10').toString()
    );
    const result = await this.superFluidService.executeLastOperation(upgrader);
    this.refreshBalances();
  }

  async upgrade(user: FakeUser) {
    console.log('user');
    const upgrader = this.fake_accounts[user].user;
    //let userDaix = this.DAI

    const tx = await this.DAI.connect(upgrader).approve(
      this.superFluidService.superToken,
      utils.parseEther('10')
    );
    const result_tx = await tx.wait();

    this.superFluidService.createUpgradeOperation(
      utils.parseEther('10').toString()
    );
    const result = await this.superFluidService.executeLastOperation(upgrader);
    this.refreshBalances();
  }

  async doFaucet(user: FakeUser) {
    const myAdress = utils.getAddress(this.fake_accounts[user].user_address);

    console.log(myAdress);

    await doSignerTransaction(
      this.DAI.transfer(myAdress, utils.parseEther('50'))
    );
    this.refreshBalances();
  }

  async refreshBalances() {
    const signerbalance =
      await this.superFluidService.SuperTokenContract.balanceOf({
        account: this.dapp.signerAddress!,
        providerOrSigner: this.dapp.signer!,
      });

    const alice = this.fake_accounts.alice;
    const bob = this.fake_accounts.bob;
    const eve = this.fake_accounts.eve;

    //// alice

    const aliceDaiBalance = await this.DAI.balanceOf(alice.user_address);
    const aliceDAIxbalance =
      await this.superFluidService.SuperTokenContract.balanceOf({
        account: alice.user_address,
        providerOrSigner: alice.user,
      });

    this.aliceBalance = (+utils.formatEther(
      await this.dapp.provider?.getBalance(alice.user_address)!
    )).toFixed(4);

    /// bob
    let bobStreams = [];
    const bobDaiBalance = await this.DAI.balanceOf(bob.user_address);
    const bobDAIxbalance =
      await this.superFluidService.SuperTokenContract.balanceOf({
        account: bob.user_address,
        providerOrSigner: bob.user,
      });

    this.bobBalance = (+utils.formatEther(
      await this.dapp.provider?.getBalance(bob.user_address)!
    )).toFixed(4);

    //// eve
    let eveStreams = [];
    const eveDaiBalance = await this.DAI.balanceOf(eve.user_address);
    const eveDAIxbalance =
      await this.superFluidService.SuperTokenContract.balanceOf({
        account: eve.user_address,
        providerOrSigner: eve.user,
      });

    this.eveBalance = (+utils.formatEther(
      await this.dapp.provider?.getBalance(eve.user_address)!
    )).toFixed(4);

   


    ///// getting Index
    const indexes = await this.superFluidService.sf.query.listIndexes({indexId:"666578568"})
    console.log(indexes)

      this.superFluidService.sf.query

    const myIndex = await (this.superFluidService.ida.getIndex({superToken:this.superFluidService.superToken, publisher:bob.user_address, indexId:"666578568",providerOrSigner:bob.user }))
    console.log(myIndex)

    //// CREATING REFRESH OBJECTS
    this.aliceStream = {
      balanceDAI: aliceDaiBalance,
      balanceDAIx: +aliceDAIxbalance,
      indexs: this.aliceStream.indexs
    };

    console.log(this.bobStream)

    this.bobStream = {
      balanceDAI: bobDaiBalance,
      balanceDAIx: +bobDAIxbalance,
      indexs: this.bobStream.indexs
    };

    this.eveStream = {
      balanceDAI: eveDaiBalance,
      balanceDAIx: +eveDAIxbalance,
      streams: []
    };
  }



  ngOnInit(): void {
  }

}
