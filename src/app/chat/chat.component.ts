import { Component, OnInit } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage } from '../classes/chat-message';
import { HttpClient } from '@angular/common/http';
import { User } from '../classes/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {

  user: User;
  messages: string[];
  private subscriptionURL = 'http://localhost:31480/socket';
  private stompClient;
  input: string;

  constructor(private http: HttpClient) {
    this.initializeWebSocketConnection();
   }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.subscriptionURL);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/chat", (message) => {
          that.messages.push(message.body);
          //console.log(message.body);
      });
    });
  }

  send(): void {
    var author = this.user.login;
    var text = author +': '+ this.input;
    this.stompClient.send("/app/send/message" , {}, text);
    //this.messages.push(text);
  }

  ngOnInit() {
    this.messages = [];
    this.messages.push("Welcome to the chat!");
    this.http.get<User>('http://localhost:31480/profile', {withCredentials: true}).subscribe(data => {
      this.user = data;
    });
  }

}
