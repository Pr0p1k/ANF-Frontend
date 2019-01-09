import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.less']
})
export class CharacterComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  setEnemy() {
    console.log('In setEnemy: ');
    document.getElementsByClassName('character')[0].classList.add('enemy');
  }

}
