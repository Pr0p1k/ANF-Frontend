import {Component, Injector, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Message} from '../classes/message';
import {User} from '../classes/user';
import {MainComponent} from '../main/main.component';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {
  user: User;
  inMessages: Message[];
  outMessages: Message[];
  dialogues: string[];
  private stompClient;
  parent = this.injector.get(MainComponent);

  constructor(private http: HttpClient, private injector: Injector) {
  }

  ngOnInit() {
    this.dialogues = [];
    // this.http.get<User>('http://localhost:8080/profile', {withCredentials: true})
    //   .subscribe(data => this.user = data);
    this.http.get<string[]>('http://localhost:31480/profile/dialogs',
      {withCredentials: true}).subscribe(data => {
      this.dialogues = data;
    });
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(){
    let ws = new SockJS("http://localhost:31480/socket");
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/user/msg", (message) => {
          var str = message.body;
          var i = str.indexOf(':');
          var author = str.substring(0, i);
          //var msg = str.substring(i+1, str.length);
          //alert(msg);
          var exists = 0;
          that.dialogues.forEach(dial => {
            if (dial === author)
              exists = 1;
          });
          if (exists === 0)
            that.dialogues.push(author);
          //console.log(message.body);
      });
    });
  }

}
