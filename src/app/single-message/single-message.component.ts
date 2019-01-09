import { Component, OnInit, Injector } from '@angular/core';
import { FriendsPageComponent } from '../friends-page/friends-page.component';

@Component({
  selector: 'app-single-message',
  templateUrl: './single-message.component.html',
  styleUrls: ['./single-message.component.less']
})
export class SingleMessageComponent implements OnInit {

  private parent = this.injector.get(FriendsPageComponent);
  private input: string;
  private username: string;

  constructor(private injector: Injector) { }

  ngOnInit() {
  }

  confirm(): void {
    this.parent.sendMessage(this.input);
  }

  cancel(): void {
    this.parent.cancelMessage();
  }

}
