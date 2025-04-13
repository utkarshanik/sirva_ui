import {Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
export const routes: Routes = [
  { path: '', redirectTo: 'navbar', pathMatch: 'full' },
  {path:'home', component:HomeComponent},
  {path:'navbar',component:NavbarComponent}
];
