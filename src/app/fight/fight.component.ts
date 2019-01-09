import {Component, OnInit} from '@angular/core';
import {FightService} from '../services/fight/fight.service';
import {User} from '../classes/user';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.less']
})
export class FightComponent implements OnInit {
  allies: User[];

  constructor(private fightService: FightService) {
  }

  ngOnInit() {
    this.allies = this.fightService.allies;
  }

}
