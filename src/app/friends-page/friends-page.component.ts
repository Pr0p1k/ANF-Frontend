import { Component, OnInit } from '@angular/core';
import {User} from '../classes/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FriendsRequest} from '../classes/friends-request';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.less']
})
export class FriendsPageComponent implements OnInit {

  friends: User[];
  inRequested: User[];
  outRequested: User[];
  private stompClient;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.friends = [];
    this.inRequested = [];
    this.outRequested = [];
    this.http.get<User[]>('http://localhost:31480/friends/requests/incoming', {withCredentials: true})
      .subscribe(data => this.inRequested = data);
    this.http.get<User[]>('http://localhost:31480/friends/requests/outgoing', {withCredentials: true})
      .subscribe(data => this.outRequested = data);
    this.http.get<User[]>('http://localhost:31480/friends', {withCredentials: true})
      .subscribe(data => this.friends = data);
    this.friends.forEach(frnd => frnd.setOffline());
    var ready = [];
    this.http.get<string[]>('http://localhost:31480/ready', {withCredentials: true})
      .subscribe(result => {ready = result;});
    this.friends.forEach(friend => {
      if (ready.includes(friend))
        friend.setOnline();
    })
  this.initializeWebSockets();
  }

  initializeWebSockets(){
    let ws = new SockJS("http://localhost:31480/socket");
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/online", (message) => {
          var str = message.body; //format: {username}:{online/offline}
          var i = str.indexOf(':');
          var user = str.substring(0, i);
          var type = str.substring(i+1, str.length);
          if (that.friends.map(friend => friend.login).includes(user)){
            if (type === 'online')
              that.friends.forEach(friend => {
                if (friend.login === user)
                  friend.setOnline();
              });
            else 
              that.friends.forEach(friend => {
                if (friend.login === user)
                  friend.setOffline();
              });
          }
      });
    });
  }

  addFriend(req: FriendsRequest): void {
    var id = req.request_id;
    this.http.post<string>('http://localhost:8080/profile/friends', {withCredentials: true,
  params: new HttpParams().append('requestId', id.toString())}).subscribe( data => {
    console.log(data);
  });
  this.friends.push(req.requestingUser);
  }

  deleteRequest(req: FriendsRequest): void {
    var username = req.friendUser.login;
    this.http.delete<string>('http://localhost:8080/profile/friends/requests', {withCredentials: true,
  params: new HttpParams().append('username', username).append('type', 'out')}).subscribe( data=> {
    console.log(data);
  });
  const id = this.outRequested.indexOf(req.friendUser);
  this.outRequested.splice(id, 1);
  }

  declineReq(req: FriendsRequest): void {
    var username = req.requestingUser.login;
    this.http.delete<string>('http://localhost:31480/blyat, urla net', {withCredentials: true,
    params: new HttpParams().append('username', username).append('type', 'in')}).subscribe(data => {
      console.log(data);
    });
    const id = this.inRequested.indexOf(req.requestingUser);
    this.inRequested.splice(id, 1);
  }

  deleteFriend(usr: User): void {
    var username = usr.login;
    this.http.delete<string>('http://localhost:31480/profile/friends', {
      withCredentials: true,
      params: new HttpParams().append('username', username)
    }).subscribe(data => {
      console.log(data);
    });
    const id = this.friends.indexOf(usr);
    this.friends.splice(id, 1);
  }

  inviteToPVP(usr: User):void {
    
  }

}
