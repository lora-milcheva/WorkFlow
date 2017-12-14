import { NgModule } from '@angular/core';

import { serviceComponents } from './index';

// Modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../../core/services/authentication/auth.service';
import { RouterModule } from '@angular/router';

// Services

@NgModule({
  declarations: [
    ...serviceComponents
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    ...serviceComponents
  ],
  providers: [AuthenticationService]
})
export class SharedModule {
}
