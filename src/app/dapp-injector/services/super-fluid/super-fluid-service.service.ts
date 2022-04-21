import { Injectable } from '@angular/core';
import {
  Framework,
  SuperToken,
  ConstantFlowAgreementV1,
  InstantDistributionAgreementV1,
  Host,
} from '@superfluid-finance/sdk-core';
import Operation from '@superfluid-finance/sdk-core/dist/module/Operation';
import { timeStamp } from 'console';
import { ethers, Signer, utils } from 'ethers';
import { DappInjector } from '../../dapp-injector.service';

@Injectable({
  providedIn: 'root',
})
export class SuperFluidServiceService {
  sf!: Framework;
  flow!: ConstantFlowAgreementV1;
  operations: Array<Operation> = [];

  superToken = '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f'; //DAIx Mumbai
  SuperTokenContract!: SuperToken;

  overrides = {
    gasPrice: utils.parseUnits('100', 'gwei'),
    gasLimit: 1000000,
  };

  constructor(private dapp: DappInjector) {}

  async getContracts() {}

  async initializeFramework() {
    if (this.sf == undefined) {
      this.sf = await Framework.create({
        networkName: 'local',
        provider: this.dapp.DAPP_STATE.defaultProvider!,
        customSubgraphQueriesEndpoint:
          'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai',
        resolverAddress: '0x8C54C83FbDe3C59e59dd6E324531FB93d4F504d3',
      });

      this.flow = this.sf.cfaV1;

      this.SuperTokenContract = await this.sf.loadSuperToken(this.superToken);
    }

    //675833120
  
  }

  ///// ---------  ---------  Money Streaming ---------  ---------  ////
  // #region Money Streaming



  async createStream(
    streamConfig: {
      flowRate: string;
      receiver: string;
      superToken: string;
      data: string;
    }
  ) {

    const createFlowOperation = this.flow.createFlow({
      flowRate: streamConfig.flowRate,
      receiver: streamConfig.receiver,
      superToken: streamConfig.superToken, //  '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f', //environment.mumbaiDAIx,
      userData: '',
    });

    try {
      this.operations.push(createFlowOperation);
    } catch (error: any) {
      console.log(error);
    }
  }

  async handleContractError(e: any) {
    // console.log(e);
    // Accounts for Metamask and default signer on all networks
    let myMessage =
      e.data && e.data.message
        ? e.data.message
        : e.error && JSON.parse(JSON.stringify(e.error)).body
        ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message
        : e.data
        ? e.data
        : JSON.stringify(e);
    if (!e.error && e.message) {
      myMessage = e.message;
    }

    try {
      let obj = JSON.parse(myMessage);
      if (obj && obj.body) {
        let errorObj = JSON.parse(obj.body);
        if (errorObj && errorObj.error && errorObj.error.message) {
          myMessage = errorObj.error.message;
        }
      }
    } catch (e) {
      //ignore
    }

    return myMessage;
  }

  async stopStream(streamConfig: {
    receiver: string;
    sender: string;
    data: string;
    superToken: string;
    signer?: Signer;
  }) {
    const stopFlowOperation = this.sf.cfaV1.deleteFlow({
      sender: streamConfig.sender,
      receiver: streamConfig.receiver,
      superToken: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f', //environment.mumbaiDAIx,
      // userData: streamConfig.data,
      overrides: {
        gasPrice: utils.parseUnits('100', 'gwei'),
        gasLimit: 2000000,
      },
    });
    this.operations.push(stopFlowOperation);
  }


  async updateStream(streamConfig: {
    receiver: string;
    sender: string;
    flowRate: string;
    data: string;
    superToken: string;
    signer?: Signer;
  }) {
    const updateFlowOperation = this.sf.cfaV1.updateFlow({
      flowRate: streamConfig.flowRate,
      sender: streamConfig.sender,
      receiver: streamConfig.receiver,
      superToken: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f', //environment.mumbaiDAIx,
      // userData: streamConfig.data,
      overrides: {
        gasPrice: utils.parseUnits('100', 'gwei'),
        gasLimit: 2000000,
      },
    });
    this.operations.push(updateFlowOperation);
  }


  calculateFlowRate(amount: any) {
    if (typeof Number(amount) !== 'number' || isNaN(Number(amount)) === true) {
      alert('You can only calculate a flowRate based on a number');
      return;
    } else if (typeof Number(amount) === 'number') {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = +monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
    return;
  }

  //// VIEW READ FUNCITONS
  async getFlow(options: {
    sender: string;
    receiver: string;
    superToken: string;
  }) {
    const result = await this.flow.getFlow({
      superToken: options.superToken,
      sender: options.sender.toLowerCase(),
      receiver: options.receiver.toLowerCase(),
      providerOrSigner: this.dapp.signer!,
    });
    return result;
  }

  async getAccountFlowInfo(options: { account: string; superToken: string }) {
    const result = await this.flow.getAccountFlowInfo({
      superToken: options.superToken,
      account: options.account,
      providerOrSigner: this.dapp.signer!,
    });
    return result;
  }

  // async getNetFlow(){
  //   await this.flow.getNetFlow({
  //     superToken: string,
  //     account: string,
  //     providerOrSigner: Signer
  //   });
  //}

  // #endregion Money Streaming

  async createIndex() {
    try {
      let id = '';
      let DAIx = '';
      let address = '';
      let shares = '2';
      let amount = '2';

      const createIndexOperation = this.sf.idaV1.createIndex({
        indexId: 'id',
        superToken: 'DAIx',
        // userData?: string
      });

      const updateSubscriptionOperation = this.sf.idaV1.updateSubscriptionUnits(
        {
          indexId: id,
          superToken: DAIx,
          subscriber: address,
          units: shares,
          // userData?: string
        }
      );
      const distributeOperation = this.sf.idaV1.distribute({
        indexId: id,
        superToken: DAIx,
        amount: amount,
        // userData?: string
      });
    } catch (error) {}
  }

  async bathcall() {
    const DAI = new ethers.Contract(
      '0xb64845d53a373d35160b72492818f0d2f51292c0',
      'daiABI',
      this.dapp.signer!
    );
    let approveAmount = 3;
    await DAI['approve'](
      '0xe3cb950cb164a31c66e32c320a800d477019dcff',
      ethers.utils.parseEther(approveAmount.toString())
    );
  }

  /////// =========== SUPERTOKENS =========== =========== /////
  // #region SuperTokens
  createUpgradeOperation(amount: string) {
    const upgradeOperaton = this.SuperTokenContract.upgrade({
      amount,
      overrides: this.overrides,
    });
    this.operations.push(upgradeOperaton);
  }

  // #endregion SuperTokens

  //// ============= EXECUTON =========== =========== /////
  // #region Execution

  async executeLastOperation(signer?: Signer) {
    /// If we don't pass an alternative signer
    if (signer == undefined) {
      signer = this.dapp.signer!;
    }
    console.log(this.operations.length);
    const lastIndex = this.operations.length - 1;
    console.log(this.operations[lastIndex]);
    const tx = await this.operations[lastIndex].exec(signer);
    const result2 = await tx.wait();
    this.operations.pop();
    console.log(this.operations.length);
    console.log(result2);

    return result2;
  }

  async executeBatchCall(signer?: Signer) {
    /// If we don't pass an alternative signer
    if (signer == undefined) {
      signer = this.dapp.signer!;
    }

    // const DAIx = await this.sf.loadSuperToken(
    //   '0xe3cb950cb164a31c66e32c320a800d477019dcff'
    // );

    try {
      // const amtToUpgrade = ethers.utils.parseEther(upgradeAmt.toString());
      // const upgradeOperation = DAIx.upgrade({
      //   amount: amtToUpgrade.toString(),
      // });
      //upgrade and create stream at once
      // const createFlowOperation = DAIx.createFlow({
      //   sender: '0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721',
      //   receiver: recipient,
      //   flowRate: flowRate,
      // });

      console.log('Upgrading tokens and creating stream...');

      await this.sf
        .batchCall(this.operations)
        .exec(signer)
        .then(function (tx) {
          console.log(
            `Congrats - you've just successfully executed a batch call!
              You have completed 2 operations in a single tx 🤯
              View the tx here:  
              View Your Stream At: 
              Network: Kovan
              Super Token: DAIx

              `
          );
        });
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }
  // #endregion Execution
  async isSuperToken() {
    const p = this.sf.loadSuperToken('sda');
  }
}
