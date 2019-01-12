import { Injectable } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SingleMessageService {

  username: string;
  closingObj: DynamicDialogRef;

  constructor() {}


  exit() {
    this.closingObj.close();
  }

}
