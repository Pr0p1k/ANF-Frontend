import {Component, Injector, OnInit} from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {MainComponent} from '../main/main.component';
import {Appearance} from '../classes/appearance';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {

  pages: MenuItem[];
  username = '';
  firstPassword = '';
  secondPassword = '';
  parent = this.injector.get(MainComponent);
  registration = false;
  appearance = new Appearance();

  constructor(private httpClient: HttpClient, private cookieService: CookieService, private injector: Injector) {
  }

  ngOnInit() {
    this.pages = [{
      label: 'Sign in', command: function () {
        document.getElementById('sign-in').style.display = 'block';
        document.getElementById('sign-up').style.display = 'none';
      }
    },
      {
        label: 'Sign up', command: function () {
          document.getElementById('sign-in').style.display = 'none';
          document.getElementById('sign-up').style.display = 'block';
        }
      }];
  }

  tryToLogin() {
    if (this.username.length < 6) {
      this.parent.messageService.add({severity: 'error', summary: 'Error', detail: 'Login is too short'});
    } else if (this.firstPassword.length < 6) {
      this.parent.messageService.add({severity: 'error', summary: 'Error', detail: 'Password is too short'});
    } else {
      const sendParams = new HttpParams()
        .append('username', this.username)
        .append('password', this.firstPassword);

      const request = this.httpClient.post('http://localhost:31480/login', null, {
        params: sendParams,
        withCredentials: true,
        responseType: 'text', observe: 'response'
      });
      request.subscribe((response) => {
        this.parent.loginSuccess();
        this.cookieService.set('username', this.username);
        this.cookieService.set('loggedIn', 'true');
      });
    }
  }

  tryToSignUp() {
    if (this.username.length < 6) {
      this.parent.messageService.add({severity: 'error', summary: 'Error', detail: 'Login is too short'});
    } else if (this.firstPassword.length < 6 || this.firstPassword !== this.secondPassword) {
      this.parent.messageService.add({severity: 'error', summary: 'Error', detail: 'Password is too short'});
    } else {
      console.log('request sent');
      const request = this.httpClient.post('http://localhost:31480/registration', {
        login: this.username,
        password: this.firstPassword
      });
      request.subscribe((data) => {
        this.registration = true;
      });
    }
  }

  changeHair() {
    const array = document.getElementsByClassName('hair');
    for (let i = 0; i < array.length; i++) {
      array[i].style.fill = this.appearance.hairColour;
      array[i].style.stroke = this.appearance.hairColour;
    }
  }

  changeSkin() {
    const array = document.getElementsByClassName('skin');
    let color = this.appearance.skinColour;
    switch (this.appearance.skinColour) {
      case 'Black':
        color = '#8E4B32';
        break;
      case 'White':
        color = '#EBCCAB';
        break;
      case 'Brown':
        color = '#C37C4D';
        break;
    }
    for (let i = 0; i < array.length; i++) {
      array[i].style.fill = color;
      array[i].style.stroke = color;
    }
  }

  changeClothes() {
    const array = document.getElementsByClassName('clothes');
    let color = this.appearance.clothesColour;
    switch (this.appearance.clothesColour) {
      case 'Black':
        color = '#272427';
        break;
      case 'White':
        color = '#E2D4E9';
        break;
      case 'Brown':
        color = 'darksalmon';
        break;
    }
    for (let i = 0; i < array.length; i++) {
      array[i].style.fill = color;
      array[i].style.stroke = color;
    }
  }

  tryToSignInWithVk() {
    window.location.replace('http://localhost:31480/login/vk');
  }

  tryToSignInWithGoogle() {
    window.location.replace('http://localhost:31480/login/google');
  }
}
