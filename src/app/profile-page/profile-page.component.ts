import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { User } from '../user'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.less']
})
export class ProfilePageComponent implements OnInit {

  public user :User;

  constructor(private http: HttpClient) {
    http.get<User>('localhost:31480/profile').subscribe(data => {
      this.user = { ...data},
      (err: HttpErrorResponse) => {
        if (err.status === 401)
          console.log("User is anauthorized.");
        else
          console.log("Client-side error.");
      }
   });
  }

  ngOnInit() {}

}
