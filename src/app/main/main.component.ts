import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService, DialogService, DynamicDialogRef, MessageService} from 'primeng/api';
import {AuthComponent} from '../auth/auth.component';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpParams} from '@angular/common/http';
import * as SockJS from 'sockjs-client';
import {CompatClient, Stomp} from '@stomp/stompjs';
import {RoomComponent} from '../room/room.component';
import {FightService} from '../services/fight/fight.service';
import {TranslateService} from '../services/translate.service';
import {TranslatePipe} from '../services/translate.pipe';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  providers: [DialogService, ConfirmationService]
})
export class MainComponent implements OnInit {
  constructor(public router: Router, private dialogService: DialogService,
              private cookieService: CookieService, private http: HttpClient,
              public messageService: MessageService, private fightService: FightService,
              private confirmationService: ConfirmationService,
              private translate: TranslateService, private pipe: TranslatePipe) {
  }

  loggedIn: boolean;
  login: string;
  dialog: DynamicDialogRef;
  private stompClient: CompatClient;
  russian = false;

  ngOnInit() {
    this.loggedIn = this.cookieService.get('loggedIn') === 'true';
    this.login = this.cookieService.get('username');
    if (this.loggedIn) {
      this.http.get('http://localhost:31480/checkCookies', {
        withCredentials: true,
        params: new HttpParams()
          .append('username', this.login)
      }).subscribe(null,
        () => {
          this.loggedIn = false;
          this.cookieService.delete('loggedIn');
          this.cookieService.delete('username');
          this.router.navigateByUrl('start');
        });
    }
    this.initializeWebsockets();
  }

  changeLanguage(): void {
    if (this.russian) {
      this.russian = false;
      this.translate.use('en');
    } else {
      this.russian = true;
      this.translate.use('ru');
    }
  }

  showLoginBlock() {
    this.dialog = this.dialogService.open(AuthComponent, {
      width: '800px', height: '400px'
    });
  }

  loginSuccess() {
    this.messageService.add({severity: 'success', summary: this.pipe.transform('Success'), detail: this.pipe.transform('Authorized')});
    this.dialog.close();
    this.loggedIn = true;
    this.initializeWebsockets();
  }

  logout() {
    this.http.get('http://localhost:31480/logout', {responseType: 'text'}).subscribe();
    this.loggedIn = false;
    this.router.navigateByUrl('start');
    this.cookieService.delete('loggedIn');
    this.cookieService.delete('username');
    this.messageService.add({severity: 'success', summary: this.pipe.transform('Success'), detail: this.pipe.transform('Logged out')});
  }

  initializeWebsockets(): void {
    const ws = new SockJS('http://localhost:31480/socket');
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/user/invite', (response) => {
        const message: string = response.body; // format: {pvp/pve}:{sender-name}
        that.fightService.type = message.substring(0, 3);
        that.fightService.author = message.substring(4, message.lastIndexOf(':'));
        that.fightService.id = Number.parseInt(message.substring(
          message.lastIndexOf(':') + 1), 10);
        that.fightService.valuesSet = true;
        that.dialog = that.dialogService.open(RoomComponent, {
          width: '200px',
          height: '200px'
        });
      });
      that.stompClient.subscribe('/user/start', (response) => {
        const message = response.body;
        const id = message.substring(message.indexOf(':') + 1);
        that.fightService.id = Number.parseInt(id, 10);
        console.log('Fight started: ' + message);
        that.router.navigateByUrl('fight/' + that.fightService.type + '/' + id);
        that.dialog.close();
      });
    });
  }

}
