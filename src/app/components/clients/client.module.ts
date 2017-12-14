import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { clientComponents } from './index';

// Modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Services
import { ClientService } from '../../core/services/client/client.service';

@NgModule({
  declarations: [
    ...clientComponents
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    ...clientComponents
  ],
  providers: [ ClientService ]
})
export class ClientModule {
}
