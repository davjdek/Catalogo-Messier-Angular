import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MessierComponent} from './messier/messier.component';
import {HomeComponent} from './home/home.component';
import {UtentiComponent} from './utenti/utenti.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './interceptors/auth.guard';
import { RegisterComponent } from './register/register.component';
import { CambioPasswordComponent } from './cambio-password/cambio-password.component';
import { PermissionGuard } from './guards/permission.guard';
import { DialogMessierComponent } from './dialog-messier/dialog-messier.component';
import { MessierDetailComponent } from './messier-detail.component/messier-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
   { path: 'messier/:sigla', component: MessierDetailComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { 
    path: 'messier', 
    component: MessierComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { requiredPermission: 'catalogo:read' }
  },
  { 
    path: 'dialog-messier', 
    component: DialogMessierComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { requiredPermission: 'catalogo:create' }
  },
  { path: 'utenti', canActivate: [AuthGuard], component: UtentiComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'cambio-password', 
    canActivate: [AuthGuard], 
    component: CambioPasswordComponent, 
    data: { title: 'Cambio password', icon: 'settings' } 
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {



}
