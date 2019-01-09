import {Component, Injector, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpRequest} from '@angular/common/http';
import {User} from '../classes/user';
import {Message} from '../classes/message';
import {MainComponent} from '../main/main.component';
import {DialogService} from 'primeng/api';
import {QueueComponent} from '../queue/queue.component';
import {AreaService} from '../area.service';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

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

  constructor(private http: HttpClient, private injector: Injector,
              private dialogService: DialogService, private areaService: AreaService,
              private cookieService: CookieService) {

  }

  ngOnInit() {
    this.loaded = true;
    this.http.get<User>('http://localhost:31480/profile', {withCredentials: true}).subscribe(data => {
      // this.loaded = true;
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
      console.log((<HTMLElement>document.getElementById('male')));
      console.log(document.getElementsByClassName('hair'));
      console.log(this.user.character.appearance);
      this.changeClothes();
      this.changeHair();
      this.changeSkin();
      this.setGender();
    }, () => {
      this.parent.router.navigateByUrl('start');
    });
    this.ready = this.cookieService.get('ready') === 'true';
    // this.http.post<string[]>('http://localhost:31480/profile/friends',
    //   null, {withCredentials: true}).subscribe(data => {
    //   this.friends = data;
    // });
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
    console.log(array);
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
    for (let i = 0; i < 11; i++) {
      console.log(array.item(i));
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
    if (this.user.character.appearance.gender) {
      (<HTMLElement>document.getElementById('female')).style.display = 'block';
      (<HTMLElement>document.getElementById('male')).style.display = 'none';
    } else {
      (<HTMLElement>document.getElementById('male')).style.display = 'block';
      (<HTMLElement>document.getElementById('female')).style.display = 'none';
    }
    this.user.character.appearance.gender = this.user.character.appearance.gender ? 'FEMALE' : 'MALE';
  }
}
