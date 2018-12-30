import {Component, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Message} from '../message';
import {User} from '../user';
import {Dialogue} from '../dialogue';
import {MainComponent} from '../main/main.component';

@Component({
  selector: 'app-messages-component',
  templateUrl: './messages-component.component.html',
  styleUrls: ['./messages-component.component.less']
})
export class MessagesComponent implements OnInit {
  user: User;
  inMessages: Message[];
  outMessages: Message[];
  dialogues: string[];


  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    // this.http.get<User>('http://localhost:8080/profile', {withCredentials: true})
    //   .subscribe(data => this.user = data);
    this.http.get<string[]>('http://localhost:31480/profile/dialogs',
      {withCredentials: true}).subscribe(data => {
      this.dialogues = data;
    });
  }

}
