import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {HttpClient, HttpParams} from '@angular/common/http';
//import {CookieService} from 'ngx-cookie-service';

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

  constructor(private httpClient: HttpClient/*, private cookieService: CookieService*/) {
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
      const request = this.httpClient.post('http://localhost:31480/login', null, {params: sendParams});
      request.subscribe(() => {
        //this.cookieService.set('JSESSIONID', 'Keksdfg');
        //console.log('cookie: ' + this.cookieService.get('JSESSIONID'));
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
      const request = this.httpClient.post('http://localhost:31480/registration', {
        login: this.username,
        password: this.firstPassword
      });
      request.subscribe((data) => console.log(data.toString()));
    }
  }
}
