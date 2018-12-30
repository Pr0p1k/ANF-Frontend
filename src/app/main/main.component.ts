import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/api';
import {AuthComponent} from '../auth/auth.component';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';
import {ProfilePageComponent} from '../profile-page/profile-page.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  providers: [DialogService]
})
export class MainComponent implements OnInit {
  constructor(public router: Router, private dialogService: DialogService, private cookieService: CookieService, private http: HttpClient) {
  }

  loggedIn: boolean;
  login: string;

  ngOnInit() {
    this.loggedIn = this.cookieService.get('loggedIn') === 'true';
    this.login = this.cookieService.get('username');
  }

  showLoginBlock() {
    const dialog = this.dialogService.open(AuthComponent, {
      width: '800px', height: '400px'
    });
  }

  openProfile() {
    this.router.navigateByUrl('profile');
  }

  logout() {
    this.http.get('http://localhost:31480/logout', {responseType: 'text'}).subscribe(() => {
      // some action here
      this.cookieService.delete('loggedIn');
      this.cookieService.delete('username');
    });
  }

}
