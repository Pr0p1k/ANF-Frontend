import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {MainComponent} from './main/main.component';
import {StartPageComponent} from './start-page/start-page.component';
import {ButtonModule} from 'primeng/button';
import {InfoPageComponent} from './info-page/info-page.component';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthComponent} from './auth/auth.component';
import {TabMenuModule, PasswordModule, InputTextModule, MessageService, InputSwitchModule, RadioButtonModule} from 'primeng/primeng';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {FormsModule} from '@angular/forms';
import { MessagesComponent } from './messages/messages.component';
import { FriendsPageComponent } from './friends-page/friends-page.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import {ToastModule} from 'primeng/toast';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    MainComponent,
    StartPageComponent,
    InfoPageComponent,
    AuthComponent,
    ProfilePageComponent,
    MessagesComponent,
    FriendsPageComponent,
    DialogueComponent,
    ChatComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    DynamicDialogModule,
    BrowserAnimationsModule,
    TabMenuModule,
    PasswordModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    InputSwitchModule,
    RadioButtonModule
  ],
  providers: [CookieService, MessageService],
  bootstrap: [MainComponent],
  entryComponents: [AuthComponent]
})
export class AppModule {
}
