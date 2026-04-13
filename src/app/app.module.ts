import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DialogMessierComponent } from './dialog-messier/dialog-messier.component';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MaterialModule} from './material/material.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from './my-date-formats';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MessierComponent} from './messier/messier.component';
import { MenuComponent } from './menu/menu.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { UtentiComponent } from './utenti/utenti.component';
import { HomeComponent } from './home/home.component';
import { DialogUtenteComponent } from './dialog-utente/dialog-utente.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule} from '@angular/forms';
import { DialogResponseComponent } from './dialog-response/dialog-response.component';
import {DialogConfirmDeleteComponent} from './dialog-confirm-delete/dialog-confirm-delete.component';
import {JwtService} from './services/jwt.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/interceptor';
import { CambioPasswordComponent } from './cambio-password/cambio-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { MessierDetailComponent } from './messier-detail.component/messier-detail.component';
// ⬇️ AGGIUNGI QUESTA IMPORTAZIONE PER IL CHATBOT
import { ChatbotComponent } from './chatbot/chatbot.component';
// ⬇️ AGGIUNGI QUESTA IMPORTAZIONE PER IL LOADING SPINNER
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu'; // Necessario per il menu a tendina

registerLocaleData(localeIt);



@NgModule({
  declarations: [
    AppComponent,
    DialogMessierComponent,
    MessierComponent,
    MenuComponent,
    UtentiComponent,
    HomeComponent,
    DialogUtenteComponent,
    LoginComponent,
    DialogResponseComponent,
    DialogConfirmDeleteComponent,
    RegisterComponent,
    CambioPasswordComponent,
    HasPermissionDirective,
    MessierDetailComponent,
    ChatbotComponent, // ⬅️ AGGIUNGI IL CHATBOT COMPONENT
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
    MaterialModule,
    MatCheckboxModule,
    MomentDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule, // ⬅️ AGGIUNGI QUESTO PER LO SPINNER DI CARICAMENTO
    MatMenuModule,
  ],
  exports:[
    HasPermissionDirective,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'it-IT' },
    JwtService
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }