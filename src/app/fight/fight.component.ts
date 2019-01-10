import {
  AfterContentInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FightService} from '../services/fight/fight.service';
import {User} from '../classes/user';
import {Boss} from '../classes/boss';
import {CharacterComponent} from '../character/character.component';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.less']
})
export class FightComponent implements OnInit, AfterContentInit {
  allies: User[];
  enemies: User[] | Boss[];
  @ViewChild('alliesContainer', {read: ViewContainerRef}) alliesContainer;
  @ViewChild('enemiesContainer', {read: ViewContainerRef}) enemiesContainer;
  componentRef: ComponentRef;

  constructor(private fightService: FightService, private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.allies = this.fightService.allies;
    this.enemies = this.fightService.enemies;
  }

  ngAfterContentInit() {
    const factory: ComponentFactory = this.resolver.resolveComponentFactory(CharacterComponent);
    let character: ComponentRef;
    for (let i = 0; i < this.allies.length; i++) {
      character = this.alliesContainer.createComponent(factory);
      const genderId = this.allies[i].character.appearance.gender === 'FEMALE' ? 1 : 0;
      const element = (<HTMLElement>(<HTMLElement>character.location.nativeElement).childNodes[genderId]);
      element.style.display = 'block';
      element.style.marginBottom = (40 + 10 * i).toString(); // TODO readjust every player
      element.style.marginLeft = (40 * i).toString();
      (<HTMLElement>(<HTMLElement>character.location.nativeElement)
        .childNodes[(genderId + 1) % 2]).style.display = 'none';
      console.log(element);
      this.setAppearance(element, this.allies[i]);
    }
    console.log(this.enemies[0].type);
    if (this.enemies[0].type === Boss) {
      // smth
    } else {
      character = this.enemiesContainer.createComponent(factory);
      const genderId = this.enemies[0].character.appearance.gender === 'FEMALE' ? 1 : 0;
      const element = (<HTMLElement>(<HTMLElement>character.location.nativeElement).childNodes[genderId]);
      element.style.display = 'block';
      element.classList.add('enemy');
      (<HTMLElement>(<HTMLElement>character.location.nativeElement)
        .childNodes[(genderId + 1) % 2]).style.display = 'none';
      console.log(element);
      this.setAppearance(element, this.enemies[0]);
    }
  }

  setAppearance(element: HTMLElement, user: User) {
    const hair = element.getElementsByClassName('hair');
    for (let i = 0; i < hair.length; i++) {
      (<HTMLElement>hair[i]).style.fill = this.chooseHair(user);
      (<HTMLElement>hair[i]).style.stroke = this.chooseHair(user);
    }
    const skin = element.getElementsByClassName('skin');
    for (let i = 0; i < skin.length; i++) {
      (<HTMLElement>skin[i]).style.fill = this.chooseSkin(user);
      (<HTMLElement>skin[i]).style.stroke = this.chooseSkin(user);
    }
    const clothes = element.getElementsByClassName('clothes');
    for (let i = 0; i < clothes.length; i++) {
      (<HTMLElement>clothes[i]).style.fill = this.chooseClothes(user);
      (<HTMLElement>clothes[i]).style.stroke = this.chooseClothes(user);
    }

  }

  chooseHair(user: User): string {
    switch (user.character.appearance.hairColour) {
      case 'YELLOW':
        return '#DEAB7F';
      case 'BROWN':
        return '#A53900';
      case 'BLACK':
        return '#2D221C';
    }
  }

  chooseSkin(user: User): string {
    switch (user.character.appearance.skinColour) {
      case 'BLACK':
        return '#6E2B12';
      case 'WHITE':
        return '#EBCCAB';
      case 'LATIN':
        return '#C37C4D';
      case 'DARK':
        return '#934C1D';
    }
  }

  chooseClothes(user: User): string {
    switch (user.character.appearance.clothesColour) {
      case 'RED':
        return 'crimson';
      case 'GREEN':
        return '#81E890';
      case 'BLUE':
        return 'cornflowerblue';
    }
  }
}
