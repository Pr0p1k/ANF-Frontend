import {Injectable} from '@angular/core';
import {User} from '../../classes/user';
import {Boss} from '../../classes/boss';

@Injectable({
  providedIn: 'root'
})
export class FightService {
  private _allies: User[];
  private _enemies: User[] | Boss[];

  get allies(): User[] {
    return this._allies;
  }

  set allies(value: User[]) {
    this._allies = value;
  }

  get enemies(): User[] | Boss[] {
    return this._enemies;
  }

  set enemies(value: User[] | Boss[]) {
    this._enemies = value;
  }

  constructor() {
  }
}
