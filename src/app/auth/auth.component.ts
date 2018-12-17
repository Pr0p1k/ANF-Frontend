import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';

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

  constructor() {
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
    if (this.username.length < 6) {// todo show warning
    } else if (this.firstPassword.length < 6) {
      // todo show warning
    } else {
      // todo ajax request
    }
  }
}
