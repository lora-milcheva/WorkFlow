import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule} from 'ng2-modal';


// Components
import { projectComponents } from './index';

// Modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Services
import { ProjectService } from '../../core/services/project/project.service';

// Pipes
import { PipesModule } from '../../core/pipes/pipes.module';

@NgModule({
  declarations: [
    ...projectComponents
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    PipesModule,
    ModalModule
  ],
  exports: [
    ...projectComponents
  ],
  providers: [ ProjectService ]
})
export class ProjectModule {
}
