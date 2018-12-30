import {Component, Injector, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Message} from '../classes/message';
import {User} from '../classes/user';
import {MainComponent} from '../main/main.component';

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
  parent = this.injector.get(MainComponent);

  constructor(private http: HttpClient, private injector: Injector) {
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
