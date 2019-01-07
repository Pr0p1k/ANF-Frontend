import {Component, Injector, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../classes/user';
import {Message} from '../classes/message';
import {MainComponent} from '../main/main.component';
import {DialogService} from 'primeng/api';
import {QueueComponent} from '../queue/queue.component';
import {AreaService} from '../area.service';

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

  constructor(private http: HttpClient, private injector: Injector,
              private dialogService: DialogService, private areaService: AreaService) {

  }

  ngOnInit() {
    this.http.get<User>('http://localhost:31480/profile', {withCredentials: true}).subscribe(data => {
      this.loaded = true;
      this.user = data;
      const dialogService = this.dialogService;
      const areaService = this.areaService;
      const array = document.getElementsByClassName('ground');
      for (let i = 0; i < array.length; i++) {
        (<HTMLElement>array[i]).onclick = function () {
          dialogService.open(QueueComponent, {width: '200px', height: '200px'});
          areaService.selectedArea = (<HTMLElement>this).id;
          // TODO Here the data about clicked area should be shared via service
        };
      }
    });
    // this.http.post<string[]>('http://localhost:31480/profile/friends',
    //   null, {withCredentials: true}).subscribe(data => {
    //   this.friends = data;
    // });
  }
}
