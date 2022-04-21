import { BigNumber } from "ethers";

export interface ISTREAM_DISPLAY {
  balanceDAIx: number | BigNumber;
  balanceDAI:number  | BigNumber;
  streams?: Array<{value:number , address:string}>;
  indexs?: Array<{id:string}>;
}


export interface IFakeUser { user: any; user_address: any }

export type FakeUser = 'alice' | 'bob' | 'eve';


export enum STREAM_ACTION {
  CREATE = 'Create Stream',
  UPDATE = 'Update Stream',
  DELETE = 'Delete Stream'
}