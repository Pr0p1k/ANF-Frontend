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
import {TabMenuModule, PasswordModule, InputTextModule} from 'primeng/primeng';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [
    MainComponent,
    StartPageComponent,
    InfoPageComponent,
    AuthComponent,
    ProfilePageComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    DynamicDialogModule,
    BrowserAnimationsModule,
    TabMenuModule,
    PasswordModule,
    InputTextModule
  ],
  providers: [],
  bootstrap: [MainComponent],
  entryComponents: [AuthComponent]
})
export class AppModule {
}
