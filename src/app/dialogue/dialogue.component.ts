import {Component, Injector, OnInit} from '@angular/core';
import {Message} from '../classes/message';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MainComponent} from '../main/main.component';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.less']
})
export class DialogueComponent implements OnInit {

  messages: Message[];
  parent = this.injector.get(MainComponent);
  interlocutor: string;
  input: string;

  constructor(private httpClient: HttpClient, private injector: Injector) {
  }

  ngOnInit() {
    this.interlocutor = this.parent.router.url;
    this.interlocutor = this.interlocutor.substring(this.interlocutor.lastIndexOf('/') + 1);
    this.httpClient.get<Message[]>('http://localhost:31480/profile/messages/dialog', {
      withCredentials: true,
      params: new HttpParams().append('secondName', this.interlocutor)
    }).subscribe((data) => {
      this.messages = data;
    });
  }

  send() {
    if (this.input.length === 0) {
      return;
    }
    this.httpClient.post('http://localhost:31480/profile/messages', null, {
      withCredentials: true,
      params: new HttpParams()
        .append('message', this.input)
        .append('receiver', this.interlocutor)
    }).subscribe();
  }

}
