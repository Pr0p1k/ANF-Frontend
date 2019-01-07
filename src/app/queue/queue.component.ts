import {Component, OnInit} from '@angular/core';
import {AreaService} from '../area.service';
import {HttpClient, HttpSentEvent} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent implements OnInit {

  area: string;
  users: string[];
  selected: string[];

  constructor(private areaService: AreaService, private http: HttpClient, private cookieService: CookieService) {
  }

  ngOnInit() {
    this.area = this.areaService.selectedArea;
    this.http.get('http://localhost:31480/ready', {withCredentials: true}).subscribe((data: string[]) => {
      this.users = data.filter((item) => item !== this.cookieService.get('username'));
    });
  }

}
