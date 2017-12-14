import { NgModule } from '@angular/core';

import { authenticationComponents } from '../../../user/index';

// Modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Services
import { AuthenticationService } from './auth.service';

@NgModule({
  declarations: [
    ...authenticationComponents
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    ...authenticationComponents
  ],
  providers: [AuthenticationService]
})
export class AuthenticationModule {
}
