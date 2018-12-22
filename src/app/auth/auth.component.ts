import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

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

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
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
      console.error('login is too short');
      // todo
    } else if (this.firstPassword.length < 6) {
      console.error('password is too short');
      // todo show warning
    } else {
      const sendParams = new HttpParams()
        .append('username', this.username)
        .append('password', this.firstPassword);
      const request = this.httpClient.post('http://localhost:8080/login', null, {
        params: sendParams,
        withCredentials: true,
        responseType: 'text', observe: 'response'
      });
      request.subscribe((response) => {
        this.cookieService.set('username', this.username);
        this.cookieService.set('loggedIn', 'true');
      });
    }
  }

  tryToSignUp() {
    if (this.username.length < 6) {
      console.error('login is too short');
      // todo
    } else if (this.firstPassword.length < 6 || this.firstPassword !== this.secondPassword) {
      console.error('password is too short');
      // todo show warning
    } else {
      console.log('request sent');
      const request = this.httpClient.post('http://localhost:8080/registration', {
        login: this.username,
        password: this.firstPassword
      });
      request.subscribe((data) => console.log(data.toString()));
    }
  }
}
