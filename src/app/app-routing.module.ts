import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StartPageComponent} from './start-page/start-page.component';
import {InfoPageComponent} from './info-page/info-page.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';

const routes: Routes = [{path: 'start', component: StartPageComponent},
  {path: '', redirectTo: 'start', pathMatch: 'full'},
  {path: 'info', component: InfoPageComponent},
  {path: 'profile', component: ProfilePageComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
