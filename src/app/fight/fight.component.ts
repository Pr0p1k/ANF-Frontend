import {AfterContentInit, Component, OnInit} from '@angular/core';
import {FightService} from '../services/fight/fight.service';
import {User} from '../classes/user';
import {Boss} from '../classes/boss';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.less']
})
export class FightComponent implements OnInit, AfterContentInit {
  allies: User[];
  enemies: User[] | Boss[];

  constructor(private fightService: FightService) {
  }

  ngOnInit() {
    this.allies = this.fightService.allies;
    this.enemies = this.fightService.enemies;
  }

  ngAfterContentInit() {
    // TODO add classes equal to usernames and apply colors on them
    // TODO find enemies and add class 'enemy' to rotate them
  }
}
