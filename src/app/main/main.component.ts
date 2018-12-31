import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService, DynamicDialogRef, MessageService} from 'primeng/api';
import {AuthComponent} from '../auth/auth.component';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  providers: [DialogService]
})
export class MainComponent implements OnInit {
  constructor(public router: Router, private dialogService: DialogService,
              private cookieService: CookieService, private http: HttpClient,
              public messageService: MessageService) {
  }

  loggedIn: boolean;
  login: string;
  dialog: DynamicDialogRef;

  ngOnInit() {
    this.loggedIn = this.cookieService.get('loggedIn') === 'true';
    this.login = this.cookieService.get('username');
  }

  showLoginBlock() {
    this.dialog = this.dialogService.open(AuthComponent, {
      width: '800px', height: '400px'
    });
  }

  loginSuccess() {
    console.log('kek');
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Authorized'});
    this.dialog.close();
    this.loggedIn = true;
    this.login = this.cookieService.get('username');
  }

  logout() {
    this.http.get('http://localhost:31480/logout', {responseType: 'text'}).subscribe();
    this.loggedIn = false;
    this.cookieService.delete('loggedIn');
    this.cookieService.delete('username');
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Logged out'});
  }

}
