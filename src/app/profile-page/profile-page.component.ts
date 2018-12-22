import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../user';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.less']
})
export class ProfilePageComponent implements OnInit {

  public user: User;
  public loaded = false;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    console.log('ЭТО ЕБУЧАЯ ОТПРАВКА ЗАПРОСА БЛЯТЬ!');
    this.http.get<User>('http://localhost:8080/profile', {withCredentials: true}).subscribe(data => {
      this.loaded = true;
      this.user = data;
    });
  }

}
