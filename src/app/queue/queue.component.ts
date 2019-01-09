import {Component, Injector, OnInit} from '@angular/core';
import {AreaService} from '../services/area/area.service';
import {HttpClient, HttpSentEvent} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Button} from 'primeng/button';
import {FightComponent} from '../fight/fight.component';
import {FightService} from '../services/fight/fight.service';
import {User} from '../classes/user';
import {MainComponent} from '../main/main.component';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent implements OnInit {

  area: string;
  users: string[];
  selected: string[];
  type: string;
  disabled: boolean;
  parent = this.injector.get(MainComponent);

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
  }

  validateAmount(event) {
    const max = this.areaService.pvp ? 1 : 5;
    if (this.selected.length > max) {
      this.users.push(this.selected.pop());
    }

    if (this.selected.length > 0) {
      this.disabled = false;
    }
  }

  break(event) {
    const max = this.areaService.pvp ? 2 : 6;
    for (let i = 0; i < this.selected.length + this.users.length - max; i++) {
      this.users.push(this.selected.pop());
    }
  }

  startFight() {
    this.fightService.allies = [];
    for (let i = 0; i <= this.selected.length; i++) {
      this.fightService.allies.push(new User());
    }
    this.parent.router.navigateByUrl('fight');
  }
}
