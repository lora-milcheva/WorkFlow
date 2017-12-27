import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { FloorPipe } from './floor-number.pipe';

@NgModule({
  imports: [],
  declarations: [ FloorPipe ],
  providers: [ FloorPipe ],
  exports: [ FloorPipe ]
})
export class PipesModule {
}
