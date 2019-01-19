import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FightEndService {

  victory: boolean;
  death: boolean;
  loss: boolean;

  constructor() { }
}
