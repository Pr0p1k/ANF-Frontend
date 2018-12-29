import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Message} from '../message';
import {User} from '../user';
import {Dialogue} from '../dialogue';

@Component({
  selector: 'app-messages-component',
  templateUrl: './messages-component.component.html',
  styleUrls: ['./messages-component.component.less']
})
export class MessagesComponent implements OnInit {

  user: User;
  inMessages: Message[];
  outMessages: Message[];
  dialogues: Dialogue[];
  

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<User>('http://localhost:8080/profile', {withCredentials: true})
      .subscribe(data => this.user = data);
    
  }

}
