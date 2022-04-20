import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConstantFlowAgreementV1,
  SuperToken,
} from '@superfluid-finance/sdk-core';
import { DappBaseComponent, DappInjector } from 'angular-web3';
import { Signer, Contract, Wallet, Bytes, utils, BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

import { interval, takeUntil } from 'rxjs';
import { DialogService } from 'src/app/dapp-components';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { SuperFluidServiceService } from 'src/app/dapp-injector/services/super-fluid/super-fluid-service.service';
import { receiveMessageOnPort } from 'worker_threads';

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
  signerStream: ISTREAM_DISPLAY = {
    balanceDAI: 0,
    balanceDAIx: 0,
    streams: [],
  };
  aliceStream: ISTREAM_DISPLAY = { balanceDAI: 0, balanceDAIx: 0, streams: [] };
  bobStream: ISTREAM_DISPLAY = { balanceDAI: 0, balanceDAIx: 0, streams: [] };
  eveStream: ISTREAM_DISPLAY = { balanceDAI: 0, balanceDAIx: 0, streams: [] };

  aliceBalance = '0';
  bobBalance = '0';
  eveBalance = '0';

  DAPP_STATE: any;
  DAIx!: SuperToken;
  DAI!: Contract;

  constructor(
    dapp: DappInjector,
    store: Store,
    private superFluidService: SuperFluidServiceService,
    private dialog: DialogService
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

    this.DAI = new Contract(
      '0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7',
      abi_ERC20,
      this.signer
    );

    const daiBalance = await this.DAI.balanceOf(this.signerAdress);
    console.log((daiBalance / 10 ** 18).toString());

    this.DAIx = await this.superFluidService.sf.loadSuperToken(
      this.superFluidService.superToken
    );

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

  // async approveSpend(user: FakeUser) {
  //   const myAdress = utils.getAddress(this.fake_accounts[user].user_address);

  //   console.log(myAdress);

  //   const tx = await this.DAI.connect(upgrader).approve(this.superFluidService.superToken,utils.parseEther("10"));
  //   const result_tx = await tx.wait();

  //   this.refreshBalances();
  // }

  async launchStream(user: FakeUser) {
    const result = await this.dialog.openOperation({
      accounts: this.fake_accounts,
      dispatcher: user,
      action: 'stream',
    });

    console.log(result);

    const sender = this.fake_accounts[user].user;
    const receiver = this.fake_accounts[result.to as FakeUser].user_address;

    const action = result.action;
    console.log(action);
    const aliceDAIxbalance =
      await this.superFluidService.SuperTokenContract.balanceOf({
        account: this.fake_accounts[user].user_address,
        providerOrSigner: sender,
      });
    console.log(aliceDAIxbalance);
    await this.superFluidService.createStream(
      {
        flowRate: result.flowRate,
        receiver,
        superToken: this.superFluidService.superToken,
        data: '',
      },
      sender
    );

    // const tx_result =  await this.superFluidService.executeLastOperation(sender)
    //console.log(tx_result)
  //  this.refreshBalances();
  }

  async refreshBalances() {
    const signerbalance = await this.superFluidService.SuperTokenContract.balanceOf({
        account: this.dapp.signerAddress!,
        providerOrSigner: this.dapp.signer!,
      });


    const alice = this.fake_accounts.alice;
    const bob = this.fake_accounts.bob;
    const eve = this.fake_accounts.eve;

    //// alice
    let aliceStreams = [];
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



    
    const flowAliceBob = await this.superFluidService.getFlow({
      superToken: this.superFluidService.superToken,
      sender: alice.user_address,
      receiver: bob.user_address,
    });
    if (+flowAliceBob.flowRate >0){
      aliceStreams.push({address:bob.user_address, value:-flowAliceBob.flowRate})
      bobStreams.push({address:alice.user_address, value:+flowAliceBob.flowRate})
    }

    const floweBobAlice = await this.superFluidService.getFlow({
      superToken: this.superFluidService.superToken,
      sender: bob.user_address,
      receiver: alice.user_address,
    });
    if (+floweBobAlice.flowRate >0){
      bobStreams.push({address:alice.user_address, value:-floweBobAlice.flowRate})
      aliceStreams.push({address:bob.user_address, value:+floweBobAlice.flowRate})
    }


    const flowAliceEve = await this.superFluidService.getFlow({
      superToken: this.superFluidService.superToken,
      sender: alice.user_address,
      receiver: eve.user_address,
    });
    if (+flowAliceEve.flowRate >0){
      aliceStreams.push({address:eve.user_address, value:-flowAliceEve.flowRate})
      eveStreams.push({address:alice.user_address, value:+flowAliceEve.flowRate})
    }


    const flowEveAlice = await this.superFluidService.getFlow({
      superToken: this.superFluidService.superToken,
      sender: eve.user_address,
      receiver: alice.user_address,
    });
    if (+flowEveAlice.flowRate >0){
      eveStreams.push({address:alice.user_address, value:-flowEveAlice.flowRate})
      aliceStreams.push({address:eve.user_address, value:+flowEveAlice.flowRate})
    }


    const flowBobEve = await this.superFluidService.getFlow({
      superToken: this.superFluidService.superToken,
      sender: bob.user_address,
      receiver: eve.user_address,
    });
    if (+flowBobEve.flowRate >0){
      bobStreams.push({address:eve.user_address, value:-flowBobEve.flowRate})
      eveStreams.push({address:bob.user_address, value:+flowBobEve.flowRate})
    }

    const flowEveBob = await this.superFluidService.getFlow({
      superToken: this.superFluidService.superToken,
      sender: eve.user_address,
      receiver: bob.user_address,
    });
    if (+flowEveBob.flowRate >0){
      eveStreams.push({address:bob.user_address, value:-flowEveBob.flowRate})
      bobStreams.push({address:eve.user_address, value:+flowEveBob.flowRate})
    }



    //// CREATING REFRESH OBJECTS
    this.aliceStream = {
      balanceDAI: aliceDaiBalance,
      balanceDAIx: +aliceDAIxbalance,
      streams: aliceStreams,
    };

    this.bobStream = {
      balanceDAI: bobDaiBalance,
      balanceDAIx: +bobDAIxbalance,
      streams: bobStreams,
    };

    this.eveStream = {
      balanceDAI: eveDaiBalance,
      balanceDAIx: +eveDAIxbalance,
      streams: eveStreams,
    };


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

  async getAccounFlow(user: FakeUser) {
    const result = await this.superFluidService.getAccountFlowInfo({
      superToken: this.superFluidService.superToken,
      account: this.fake_accounts[user].user_address,
    });
    return result;
  }

  async stopQuery() {
    this.destroyHooks.next();
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

  async stopStream(receiver: FakeUser) {
    await this.superFluidService.stopStream({
      sender: this.dapp.signerAddress!,
      superToken: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f',
      receiver: this.fake_accounts[receiver].user_address,
      data: '',
    });
  }

  getAllStreamsByAccount(sccount: string) {}
}
