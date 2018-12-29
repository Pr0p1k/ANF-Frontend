import { Component, OnInit } from '@angular/core';
import {User} from '../user';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.less']
})
export class FriendsPageComponent implements OnInit {

  friends: User[];

  constructor() { }

  ngOnInit() {
  }

}
