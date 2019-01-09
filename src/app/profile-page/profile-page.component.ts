import {Component, Injector, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpRequest} from '@angular/common/http';
import {User} from '../classes/user';
import {Message} from '../classes/message';
import {MainComponent} from '../main/main.component';
import {DialogService} from 'primeng/api';
import {QueueComponent} from '../queue/queue.component';
import {AreaService} from '../services/area/area.service';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.less']
})
export class ProfilePageComponent implements OnInit {
  public user: User;
  public loaded = false;
  public unreadMessages: Message[];
  public friends: string[];
  public parent = this.injector.get(MainComponent);
  public ready = false;
  private stompClient;

  constructor(private http: HttpClient, private injector: Injector,
              private dialogService: DialogService, private areaService: AreaService,
              private cookieService: CookieService) {

  }

  ngOnInit() {
    this.http.get<User>('http://localhost:31480/profile', {withCredentials: true}).subscribe(data => {
      this.user = data;
      const dialogService = this.dialogService;
      const areaService = this.areaService;
      const array = document.querySelectorAll('.ground, .bidju');
      for (let i = 0; i < array.length; i++) {
        (<HTMLElement>array[i]).onclick = function () {
          dialogService.open(QueueComponent, {width: '440px', height: '200px'});
          areaService.selectedArea = (<HTMLElement>this).id;
          areaService.pvp = (<HTMLElement>array[i]).classList.contains('ground');
        };
      }
      this.changeClothes();
      this.changeHair();
      this.changeSkin();
      this.setGender();
      this.loaded = true;
    }, () => {
      this.parent.router.navigateByUrl('start');
    });
    this.ready = this.cookieService.get('ready') === 'true';
    this.subscribeForWebsockets();
  }

  subscribeForWebsockets() {
    let ws = new SockJS("http://localhost:31480/socket");
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/online", (message) => {
        var str = message.body; //format: {username}:{online/offline}
          var i = str.indexOf(':');
          var user = str.substring(0, i);
          var type = str.substring(i+1, str.length);
          if (user === that.user.login && type === 'offline' && that.ready === true) {
            that.ready = false;
            
          }
      });});
  }

  public changeReadyState() {
    let request: Observable<Object>;
    if (this.ready) {
      request = this.http.get('http://localhost:31480/profile/online', {withCredentials: true});
    } else {
      request = this.http.get('http://localhost:31480/profile/offline', {withCredentials: true});
    }
    request.subscribe(() => {
      this.cookieService.set('ready', this.ready.toString());
    });
  }

  changeHair() {
    const array = document.getElementsByClassName('hair');
    let color = this.user.character.appearance.hairColour;
    switch (this.user.character.appearance.hairColour) {
      case 'YELLOW':
        color = '#DEAB7F';
        break;
      case 'BROWN':
        color = '#A53900';
        break;
      case 'BLACK':
        color = '#2D221C';
        break;
    }
    for (let i = 0; i < array.length; i++) {
      (<HTMLElement>array[i]).style.fill = color;
      (<HTMLElement>array[i]).style.stroke = color;
    }
  }

  changeSkin() {
    const array = document.getElementsByClassName('skin');
    let color = this.user.character.appearance.skinColour;
    switch (this.user.character.appearance.skinColour) {
      case 'BLACK':
        color = '#6E2B12';
        break;
      case 'WHITE':
        color = '#EBCCAB';
        break;
      case 'LATIN':
        color = '#C37C4D';
        break;
      case 'DARK':
        color = '#934C1D';
        break;
    }
    for (let i = 0; i < array.length; i++) {
      (<HTMLElement>array[i]).style.fill = color;
      (<HTMLElement>array[i]).style.stroke = color;
    }
  }

  changeClothes() {
    const array = document.getElementsByClassName('clothes');
    let color = this.user.character.appearance.clothesColour;
    switch (this.user.character.appearance.clothesColour) {
      case 'RED':
        color = 'crimson';
        break;
      case 'GREEN':
        color = '#81E890';
        break;
      case 'BLUE':
        color = 'cornflowerblue';
        break;
    }
    for (let i = 0; i < array.length; i++) {
      (<HTMLElement>array[i]).style.fill = color;
      (<HTMLElement>array[i]).style.stroke = color;
    }
  }

  setGender() {
    const males = document.getElementsByClassName('male');
    const females = document.getElementsByClassName('female');
    if (this.user.character.appearance.gender === 'FEMALE') {
      (<HTMLElement>females[0]).style.display = 'block';
      (<HTMLElement>males[0]).style.display = 'none';
    } else {
      (<HTMLElement>males[0]).style.display = 'block';
      (<HTMLElement>females[0]).style.display = 'none';
    }
    this.user.character.appearance.gender = this.user.character.appearance.gender ? 'FEMALE' : 'MALE';
  }
}
