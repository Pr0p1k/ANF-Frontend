import {
  AfterContentInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef, Injector,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FightService} from '../services/fight/fight.service';
import {User} from '../classes/user';
import {Boss} from '../classes/boss';
import {CharacterComponent} from '../character/character.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MainComponent} from '../main/main.component';
import {Character} from '../classes/character';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {log} from 'util';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.less'],
  animations: [
    trigger('attack', [
      state('default', style({
        display: 'none',
        position: 'fixed',
        width: '15%',
        height: 'auto',
        top: '250px',
        left: '50%'
      })),
      state('use', style({
        position: 'fixed',
        display: 'block',
        width: '15%',
        height: 'auto'
      })),
      transition('default => use', [
        animate('0.5s')
      ]),
      transition('use => default', animate('0.5s'))
    ]),
  ]
})
export class FightComponent implements OnInit {
  allies: User[] = [];
  enemies: User[] = [];
  boss: Boss;
  @ViewChild('alliesContainer', {read: ViewContainerRef}) alliesContainer;
  @ViewChild('enemiesContainer', {read: ViewContainerRef}) enemiesContainer;
  fightersElements: HTMLElement[];
  skills: string[] = [];
  parent = this.injector.get(MainComponent);
  loaded = false;
  type: string;
  private stompClient;
  id: number;
  selectedSpell: string;
  map: { [key: string]: string } = {};
  kek = false;

  constructor(private fightService: FightService, private resolver: ComponentFactoryResolver,
              private http: HttpClient, private injector: Injector) {
  }

  ngOnInit() {
    if (!this.fightService.valuesSet) {
      const url = this.parent.router.url;
      this.id = Number.parseInt(url.substring(11), 10);
      this.type = url.substring(7, 10);
    } else {
      this.id = this.fightService.id;
      this.type = this.fightService.type;
    }
    this.http.post('http://localhost:31480/fight/info', null, {
      withCredentials: true,
      params: new HttpParams().append('id', this.id.toString())
    }).subscribe((data: {
      id: number, type: string,
      fighters1: User, fighters2: User
    }) => {
      if (data.fighters2.login === this.parent.login) {
        const tmp = data.fighters1;
        data.fighters1 = data.fighters2;
        data.fighters2 = tmp;
      }
      this.allies = [data.fighters1];
      this.enemies = [data.fighters2];
      console.log(data);
      const spells = data.fighters1.character.spellsKnown;
      this.skills.push('Physical attack');
      this.map['Physical attack'] = 'Physical attack\n' +
        'Damage: ' + data.fighters1.character.physicalDamage + '\nChakra: 0';
      spells.forEach((it) => {
        this.skills.push(it.spellUse.name);
        this.map[it.spellUse.name] = it.spellUse.name +
          '\nDamage: ' + (it.spellUse.baseDamage) + '\nChakra: ' + it.spellUse.baseChakraConsumption;
      });
      this.loaded = true;
      this.init();
    });
  }

  initializeWebSockets() {
    
  }

  init() {
    const factory = this.resolver.resolveComponentFactory(CharacterComponent);
    let character: ComponentRef<CharacterComponent>;
    this.fightersElements = [];
    console.log(this.allies);
    for (let i = 0; i < this.allies.length; i++) {
      character = this.alliesContainer.createComponent(factory);
      const genderId = this.allies[this.allies.length - i - 1].character.appearance.gender === 'FEMALE' ? 1 : 0;
      const element = (<HTMLElement>(<HTMLElement>character.location.nativeElement).childNodes[1 + genderId]);
      this.fightersElements.push(element);
      element.style.display = 'block';
      this.setPosition(element, i);
      (<HTMLElement>(<HTMLElement>character.location.nativeElement)
        .childNodes[1 + (genderId + 1) % 2]).style.display = 'none';
      const stats = (<HTMLElement>(<HTMLElement>character.location.nativeElement).childNodes[0]);
      this.fightersElements.push(stats);
      this.setPosition(stats, i, 125);

      (<HTMLElement>stats
        .getElementsByClassName('name')[0])
        .innerText = this.allies[this.allies.length - i - 1].login;
      this.setHPPercent(stats, 100);
      this.setChakraPercent(stats, 100);
      this.setAppearance(element, this.allies[this.allies.length - i - 1]);
    }
    if (this.type === 'pvp') {
      character = this.enemiesContainer.createComponent(factory);
      const genderId = this.enemies[0].character.appearance.gender === 'FEMALE' ? 1 : 0;
      const element = (<HTMLElement>(<HTMLElement>character.location.nativeElement).childNodes[1 + genderId]);
      element.style.display = 'block';
      element.classList.add('enemy');
      (<HTMLElement>(<HTMLElement>character.location.nativeElement)
        .childNodes[1 + (genderId + 1) % 2]).style.display = 'none';
      console.log(element);
      this.setAppearance(element, this.enemies[0]);
      const stats = (<HTMLElement>(<HTMLElement>character.location.nativeElement).childNodes[0]);
      const login = this.enemies[0].login;
      (<HTMLElement>stats
        .getElementsByClassName('name')[0])
        .innerText = login;
      element.addEventListener('click', () => {
        this.attack(1);
      }); // TODO not sure about num
    }
  }

  attack(enemyNumber: number): any {
    console.log('attack');
    this.kek = true;
    this.http.post('http://localhost:31480/fight/attack', null, {
      withCredentials: true,
      params: new HttpParams()
        .append('fightId', this.id.toString())
        .append('enemyNumber', enemyNumber.toString())
        .append('spellname', this.selectedSpell)
    }).subscribe((data) => {
      console.log(data);
    }, () => {
    });
  }

  selectSpell(event: MouseEvent) {
    this.selectedSpell = event.srcElement.id;
  }

  setPosition(element: HTMLElement, i: number, margin = 0) {
    element.style.position = 'absolute';
    element.style.bottom = (margin + 40 * ((i + 1) % 2)) + 'px';
    element.style.left = (80 * Math.round(i / 2) + 40 * ((i + 1) % 2)) + 'px';
  }

  setHPPercent(stats: HTMLElement, hp: number) {
    (<HTMLElement>stats.getElementsByClassName('hp')[0]).style.width = hp + '%';
  }

  setChakraPercent(stats: HTMLElement, mp: number) {
    (<HTMLElement>stats.getElementsByClassName('mp')[0]).style.width = mp + '%';
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
