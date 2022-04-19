import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamDisplayComponent } from './stream-display/stream-display.component';



@NgModule({
  declarations: [StreamDisplayComponent],
  imports: [
    CommonModule
  ],
  exports:[StreamDisplayComponent]
})
export class StreamDisplayModule { }
