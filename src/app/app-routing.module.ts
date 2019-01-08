import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StartPageComponent} from './start-page/start-page.component';
import {InfoPageComponent} from './info-page/info-page.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {MessagesComponent} from './messages/messages.component';
import {FriendsPageComponent} from './friends-page/friends-page.component';
import {DialogueComponent} from './dialogue/dialogue.component';
import {FightComponent} from './fight/fight.component';

const routes: Routes = [{path: 'start', component: StartPageComponent},
  {path: '', redirectTo: 'start', pathMatch: 'full'},
  {path: 'info', component: InfoPageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'messages', component: MessagesComponent},
  {path: 'friends', component: FriendsPageComponent},
  {path: 'dialogue/:login', component: DialogueComponent},
  {path: 'fight', component: FightComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
