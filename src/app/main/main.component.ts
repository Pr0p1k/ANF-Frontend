import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/api';
import {AuthComponent} from '../auth/auth.component';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  providers: [DialogService]
})
export class MainComponent implements OnInit {

  constructor(public router: Router, private dialogService: DialogService, private cookieService: CookieService) {
  }

  loggedIn: boolean;
  login: string;

  ngOnInit() {
    console.log(this.cookieService.getAll());
    const login = this.cookieService.get('JSESSIONID');
    this.login = login;
    this.loggedIn = login.length >= 6;
  }

  showLoginBlock() {
    const dialog = this.dialogService.open(AuthComponent, {
      width: '800px', height: '400px'
    });
  }

  openProfile() {
    this.router.navigateByUrl('profile');
  }

}
