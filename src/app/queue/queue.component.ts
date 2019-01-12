import {Component, Injector, OnInit} from '@angular/core';
import {AreaService} from '../services/area/area.service';
import {HttpClient, HttpParams, HttpSentEvent} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Button} from 'primeng/button';
import {FightComponent} from '../fight/fight.component';
import {FightService} from '../services/fight/fight.service';
import {User} from '../classes/user';
import {MainComponent} from '../main/main.component';
import {CompatClient, Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent implements OnInit {

  area: string;
  users: string[];
  selected: string[];
  private stompClient: CompatClient;
  type: string;
  disabled: boolean;
  parent = this.injector.get(MainComponent);
  id: number;

  constructor(private areaService: AreaService, private http: HttpClient,
              private cookieService: CookieService, private fightService: FightService,
              private injector: Injector) {
  }

  ngOnInit() {
    this.area = this.areaService.selectedArea;
    this.type = this.areaService.pvp ? 'PVP' : 'PVE';
    this.http.get('http://localhost:31480/ready', {withCredentials: true}).subscribe((data: string[]) => {
      this.users = data.filter((item) => item !== this.cookieService.get('username'));
    });
    this.selected = [];
    this.disabled = this.areaService.pvp;
    this.initializeWebsockets();
    this.http.get('http://localhost:31480/fight/createQueue', {
      withCredentials: true
    }).subscribe((response: { queueId: number }) => {
      this.id = response.queueId;
    });
  }

  validateAmount(event) {
    console.log('Move one called');
    const max = this.areaService.pvp ? 1 : 5;
    if (this.selected.length > max) {
      this.users.push(this.selected.pop());
    }

    if (this.selected.length > 0) {
      this.disabled = false;
      // TODO enable if joined
    }

    for (let i = 0; i < this.selected.length; i++) {
      this.send(this.areaService.pvp ? 'pvp' : 'pve', this.selected[i], this.id);
    }
  }

  startFight() {
    if (this.areaService.pvp) {
      this.http.get<User>('http://localhost:31480/users/' + this.parent.login, {
        withCredentials: true
      }).subscribe(ally => {
        this.fightService.allies = [ally];
        this.http.get<User>('http://localhost:31480/users/' + this.selected[0], {
          withCredentials: true
        }).subscribe(enemy => {
          this.fightService.enemies = [enemy];
          this.parent.router.navigateByUrl('fight');

          // TODO close dialog
        });
      });
    } else {
      this.fightService.allies = [];
      this.selected.push(this.parent.login);
      console.log('Selected: ' + this.selected);
      let responded = 0;
      for (let i = 0; i < this.selected.length; i++) {
        this.http.get<User>('http://localhost:31480/users/' + this.selected[i], {
          withCredentials: true
        }).subscribe(ally => {
          this.fightService.allies.push(ally);
          responded++;
          if (responded === this.selected.length) {
            this.parent.router.navigateByUrl('fight');
            // TODO close dialog
          }
        });
      }
    }
  }

  send(type: string, username: string, id: number): void {
    this.http.get('http://localhost:31480/fight/invite', {
      withCredentials: true,
      params: new HttpParams()
        .append('type', type)
        .append('username', username)
        .append('id', id.toString())
    })
      .subscribe(() => {
        console.log(document.getElementsByClassName('ui-picklist-target'));
        const array = document.getElementsByClassName('ui-picklist-target')[0]
          .getElementsByClassName('ready');
        console.log(array);
        for (let j = 0; j < array.length; j++) {
          console.log(array[j]);
          array[j].classList.replace('ready', 'pending');
        }
      });
  }

  initializeWebsockets(): void {
    const ws = new SockJS('http://localhost:31480/socket');
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/user/approval', (message) => {
        console.log('Approval: ' + message);
        const username = message.body.substring(0, message.body.indexOf(':'));
        const pending = document.getElementsByClassName('ui-picklist-target')[0]
          .getElementsByClassName('pending');
        for (let i = 0; i < pending.length; i++) {
          console.log(pending[i].innerHTML);
          if (pending[i].innerHTML === username) {
            pending[i].classList.replace('pending', 'ready');
            break;
          }
        }
      });
    });
  }

}
