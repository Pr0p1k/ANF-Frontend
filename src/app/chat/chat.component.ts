import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
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
  private subscriptionURL = 'http://localhost:8080/chat';
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
        if(message.body) {
          that.messages.push(message);
          console.log(message.body);
        }
      });
    });
  }

  send(): void {
    var msg = new ChatMessage();
    msg.author = this.user.login;
    msg.text = this.input;
    this.stompClient.send("/app/send/chat" , {}, msg);
  }

  ngOnInit() {
    this.http.get<User>('http://localhost:31480/profile', {withCredentials: true}).subscribe(data => {
      this.user = data;
    });
  }

}
