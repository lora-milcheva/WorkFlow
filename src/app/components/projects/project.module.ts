import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { projectComponents } from './index';

// Modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Services
import { ProjectService } from '../../core/services/project/project.service';

@NgModule({
  declarations: [
    ...projectComponents
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    ...projectComponents
  ],
  providers: [ ProjectService ]
})
export class ProjectModule {
}
