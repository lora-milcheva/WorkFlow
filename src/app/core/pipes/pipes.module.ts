import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FloorPipe } from './floor-number.pipe';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ FloorPipe ],
  providers: [ ],
  exports: [ FloorPipe ]
})
export class PipesModule {
}
