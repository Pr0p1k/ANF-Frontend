import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../user';
import {Message} from '../message'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.less']
})
export class ProfilePageComponent implements OnInit {

  public user: User;
  public loaded = false;
  public unreadMessages: Message[];
  public friends: string[];

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.http.get<User>('http://localhost:31480/profile', {withCredentials: true}).subscribe(data => {
      this.loaded = true;
      this.user = data;
    });
    this.http.get<Message[]>('http://loclhost:8080/profile/messages/unread', 
    {withCredentials: true}).subscribe(data => {
      this.unreadMessages = data;
    });
    this.http.get<string[]>('http://localhost:8080/profile/friends', 
      {withCredentials: true}).subscribe(data => {
        this.friends = data;
      });
  }

}
