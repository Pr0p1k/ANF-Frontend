import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private _selectedArea: string;

  get selectedArea(): string {
    return this._selectedArea;
  }

  set selectedArea(value: string) {
    this._selectedArea = value;
  }

  constructor() {
  }
}
