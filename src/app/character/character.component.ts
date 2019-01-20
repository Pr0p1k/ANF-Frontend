import {Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {User} from '../classes/user';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.less']
})
export class CharacterComponent implements OnInit {

  @ViewChild('stats') stats: ElementRef;
  @ViewChild('male') male: ElementRef;
  @ViewChild('female') female: ElementRef;
  @ViewChild('boss') boss: ElementRef;
  private _bossId = 1;

  get bossId(): number {
    return this._bossId;
  }

  set bossId(value: number) {
    this._bossId = value;
    (<HTMLElement>this.male.nativeElement).style.display = 'none';
    (<HTMLElement>this.female.nativeElement).style.display = 'none';
    (<HTMLImageElement>this.boss.nativeElement).style.display = 'block';
  }

  constructor() {
  }

  ngOnInit() {
  }

}
