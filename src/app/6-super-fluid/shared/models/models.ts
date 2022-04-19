export interface ISTREAM_DISPLAY {
  balanceDAIx: number;
  balanceDAI:number;
  streams: Array<{value:number, address:string}>;
}


export interface IFakeUser { user: any; user_address: any }

export type FakeUser = 'alice' | 'bob' | 'eve';