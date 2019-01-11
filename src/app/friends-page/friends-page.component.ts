import { Component, OnInit } from '@angular/core';
import {User} from '../classes/user';
import {HttpClient, HttpParams, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { SingleMessageComponent} from '../single-message/single-message.component';
import { SingleMessageService } from '../services/single-message.service';
import {ConfirmationService, DialogService, DynamicDialogRef, MessageService} from 'primeng/api';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.less'],
  providers: [DialogService, ConfirmationService]
})
export class FriendsPageComponent implements OnInit {

  friends: User[];
  inRequested: User[];
  outRequested: User[];
  private stompClient;
  private dialog: DynamicDialogRef;

  constructor(private http: HttpClient, private dialogService: DialogService,
    private confirmationService: ConfirmationService, private msgServ: SingleMessageService) { }

  ngOnInit() {
    this.friends = [];
    this.inRequested = [];
    this.outRequested = [];
    this.http.get<User[]>('http://localhost:31480/friends/requests/incoming', {withCredentials: true})
      .subscribe(data => this.inRequested = data);
    this.http.get<User[]>('http://localhost:31480/friends/requests/outgoing', {withCredentials: true})
      .subscribe(data => this.outRequested = data);
    this.http.get<User[]>('http://localhost:31480/friends', {withCredentials: true})
      .subscribe(data => {
        this.friends = data
        this.checkOnline();
      });
    
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
                if (friend.login === user) {
                  friend.online = true;
                  friend.offline = false;
                }
              });
            else 
              that.friends.forEach(friend => {
                if (friend.login === user) {
                  friend.offline = true;
                  friend.online = false;
                }
              });
          }
      });
      that.stompClient.subscribe("/user/social", message => {
        var str = message.body;
        var i = str.indexOf(':');
        var event = str.substring(0, i);
        //console.log("event: "+event);
        if (event === 'friend') {
          var type = str.substring(i+1, i+2);
          //console.log("type: "+type);
          if (type === '+' || type === 'o'){
            var username = str.substring(i+2, str.length);
            var user: User;
            //console.log("username: "+username);
            var url = 'http://localhost:31480/users/'+username;
            that.http.get<User>(url, {withCredentials: true})
              .subscribe(data => {
                user = data;
                user.online = false;
                user.offline = true;
                var ready = [];
                that.http.get<string[]>('http://localhost:31480/ready', {withCredentials: true})
              .subscribe(data => {
                ready = data;
                if (ready.includes(user.login)) {
                  user.online = true;
                  user.offline = false;
                }
              });
              that.friends.push(user);
              });
              if (type === '+') {
                var ind = that.outRequested.indexOf(user);
                that.outRequested.splice(ind, 1);
              } else {
                var ind = that.inRequested.indexOf(user);
                that.inRequested.splice(ind, 1);
              }
          } else {
            var username = str.substring(i+2, str.length);
            var user: User;
            //console.log("username: "+username);
            var url = 'http://localhost:31480/users/'+username;
            that.http.get<User>(url, {withCredentials: true})
              .subscribe(data => {user = data});
            that.friends.splice(that.friends.indexOf(user), 1);
          }
        } else if (event === 'request'){
          var type = str.substring(i+1, i+2);
          //console.log("type: "+type);
          if (type === '+' || type === 'o'){
            var username = str.substring(i+2, str.length);
            var user: User;
            //console.log("username: "+username);
            var url = 'http://localhost:31480/users/'+username;
            that.http.get<User>(url, {withCredentials: true})
              .subscribe(data => {
                user = data;
                if (type === '+')
                  that.inRequested.push(user);
                else
                  that.outRequested.push(user);
              });
          } else {
            var username = str.substring(i+2, str.length);
            var user: User;
            //console.log("username: "+username);
            var url = 'http://localhost:31480/users/'+username;
            that.http.get<User>(url, {withCredentials: true})
              .subscribe(data => {
                user = data;
                that.inRequested.splice(that.inRequested.indexOf(user), 1);
              });
          }
        } else {
          var username = str.substring(i+1, str.length);
            var user: User;
            //console.log("username: "+username);
            var url = 'http://localhost:31480/users/'+username;
            that.http.get<User>(url, {withCredentials: true})
              .subscribe(data => {
                user = data;
                that.outRequested.splice(that.outRequested.indexOf(user), 1);
              });
            
        }
      });
    });
  }

  addFriend(req: User): void {
    req.offline = true;
    req.online = false;
    this.http.post('http://localhost:31480/profile/friends', 
    new HttpParams().set('login', req.login),
    { headers:
      new HttpHeaders (
      {   
          "Content-Type": "application/x-www-form-urlencoded"
      }), 
    withCredentials: true }).subscribe( msg => {});
    this.http.get<string[]>('http://localhost:31480/ready', {withCredentials: true})
      .subscribe(data => {
        var ready: string[] = data;
        if (ready.includes(req.login)) {
          req.offline = false;
          req.online = true;
        }
      });
    this.friends.push(req);
    this.inRequested.splice(this.inRequested.indexOf(req), 1);
  }

  deleteRequest(req: User): void {
    var username = req.login;
    this.http.delete<string>('http://localhost:31480/profile/friends/requests', {withCredentials: true,
  params: new HttpParams().append('username', username).append('type', 'out')}).subscribe( data=> {
    console.log(data);
  });
  const id = this.outRequested.indexOf(req);
  this.outRequested.splice(id, 1);
  }

  checkOnline(){
    this.friends.forEach(frnd => {
      frnd.offline = true;
      frnd.online = false;
    });
    let ready: string[];
    this.http.get<string[]>('http://localhost:31480/ready', {withCredentials: true})
      .subscribe(result => {
        console.log(result);
        this.friends.forEach(friend => {
          if (result.includes(friend.login)){
            friend.online = true;
            friend.offline = false;
          };
      });
    });
    //ready.forEach(rd => console.log(rd));
    
  }

  declineReq(req: User): void {
    var username = req.login;
    this.http.delete<string>('http://localhost:31480/profile/friends/requests', {withCredentials: true,
    params: new HttpParams().append('username', username).append('type', 'in')}).subscribe(data => {
      console.log(data);
    });
    const id = this.inRequested.indexOf(req);
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

  showMessageInput(user: User): void {
    this.msgServ.username = user.login;
    this.dialog = this.dialogService.open(SingleMessageComponent, {
      width: '800px', height: '400px'
    });
    this.msgServ.closingObj = this.dialog;
  }

}
