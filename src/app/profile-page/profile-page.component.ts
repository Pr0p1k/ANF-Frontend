import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.less']
})
export class ProfilePageComponent implements OnInit {

  username :string;
  chLevel :number;
  animalRace :object;
  fightsNum :number;
  winsNum :number;
  lossesNum :number;
  deathsNum :number;
  rating :number;
  experience :number;
  freePoints :number;

  constructor(private http: HttpClient) {
    http.get('localhost:31480/profile');
    //to finish
   }

  ngOnInit() {
    //ajax for user, character and stats
  }

}
