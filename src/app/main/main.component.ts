import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/api';
import {InfoPageComponent} from '../info-page/info-page.component';
import {DialogService} from 'primeng/api';
import {AuthComponent} from '../auth/auth.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  providers: [DialogService]
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private dialogService: DialogService) {
  }

  loggedIn(): boolean {
    // TODO correct return
    return false;
  }

  ngOnInit() {
  }

  showLoginBlock() {
    const dialog = this.dialogService.open(AuthComponent, {
      width: '700', height: '300'
    });
  }
}
