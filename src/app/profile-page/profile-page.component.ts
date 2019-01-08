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
    this.http.get<User>('http://localhost:31480/profile', {withCredentials: true}).subscribe(data => {
      this.loaded = true;
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
}
