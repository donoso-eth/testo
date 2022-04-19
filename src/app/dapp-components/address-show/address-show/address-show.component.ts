import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { createIcon } from '@download/blockies';
import {IBALANCE } from 'angular-web3'


@Component({
  selector: 'address-show',
  templateUrl: './address-show.component.html',
  styleUrls: ['./address-show.component.css']
})
export class AddressShowComponent implements OnChanges {
 shortAddress!:string;

  constructor() { }

  @Input() address_to_show!:string;

  ngOnChanges(changes: SimpleChanges): void {



  }




  





}
