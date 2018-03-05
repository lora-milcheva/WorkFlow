import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

// NG Modules
import { AppRoutesModule } from './routes.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule} from 'ng2-modal';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Toastr
import {ToastModule} from 'ng2-toastr/ng2-toastr';

// My custom modules
import { UserModule } from './user/user.module';
import { SharedModule } from './components/shared/shared.module';
import { ProjectModule } from './components/projects/project.module';
import { ClientModule } from './components/clients/client.module';

// Pipes
import { PipesModule } from './core/pipes/pipes.module';

// Components
import { AppComponent } from './app.component';

// Guards
import { AuthGuard } from './core/guards/auth.guard';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutesModule,
    ModalModule,
    NgbModule.forRoot(),
    ToastModule.forRoot(),
    SharedModule,
    UserModule,
    ProjectModule,
    ClientModule,
    PipesModule
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
