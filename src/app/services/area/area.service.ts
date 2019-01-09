import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private _selectedArea: string;
  private _pvp: boolean;

  get pvp(): boolean {
    return this._pvp;
  }

  set pvp(value: boolean) {
    this._pvp = value;
  }

  get selectedArea(): string {
    return this._selectedArea;
  }

  set selectedArea(value: string) {
    this._selectedArea = value;
  }

  constructor() {
  }
}
