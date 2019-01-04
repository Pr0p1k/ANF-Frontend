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
  messages: ChatMessage[];
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
          var str = message.body;
          var i = str.indexOf(':');
          var author = str.substring(0, i);
          var msg = str.substring(i+1, str.length);
          var mes = new ChatMessage(author, msg);
          that.messages.push(mes);
          //console.log(message.body);
      });
    });
  }

  send(): void {
    var txt = this.user.login + ": "+this.input;
    this.stompClient.send("/app/send/message" , {}, txt);
    this.input = '';
    //this.messages.push(text);
  }

  ngOnInit() {
    this.messages = [];
    var msg = new ChatMessage('SYSTEM', 'Welcome to the chat!');
    this.messages.push(msg);
    this.http.get<User>('http://localhost:31480/profile', {withCredentials: true}).subscribe(data => {
      this.user = data;
    });
  }

}