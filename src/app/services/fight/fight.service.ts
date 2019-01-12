import {Injectable} from '@angular/core';
import {User} from '../../classes/user';
import {Boss} from '../../classes/boss';

@Injectable({
  providedIn: 'root'
})
export class FightService {
  private _allies: User[];
  private _enemies: User[] | Boss[];
  private _id: number;
  private _type: string;
  private _author: string;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get author(): string {
    return this._author;
  }

  set author(value: string) {
    this._author = value;
  }

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
