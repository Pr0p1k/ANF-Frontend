import { Component, OnInit } from '@angular/core';
import {User} from '../classes/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FriendsRequest} from '../classes/friends-request';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.less']
})
export class FriendsPageComponent implements OnInit {

  friends: User[];
  inRequested: User[];
  outRequested: User[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
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
