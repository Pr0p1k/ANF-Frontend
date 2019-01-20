import {
  AfterContentInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef, ElementRef, Injector, OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FightService} from '../services/fight/fight.service';
import {FightEndService} from '../services/fight-end.service';
import {User} from '../classes/user';
import {FightResultComponent} from '../fight-result/fight-result.component';
import {Boss} from '../classes/boss';
import {CharacterComponent} from '../character/character.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MainComponent} from '../main/main.component';
import {ConfirmationService, DialogService, DynamicDialogRef, MessageService} from 'primeng/api';
import {Character} from '../classes/character';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {log} from 'util';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {Router} from '@angular/router';
import {TranslateService} from '../services/translate.service';
import {TranslatePipe} from '../services/translate.pipe';
import {FocusTrap} from '@angular/cdk/typings/esm5/a11y';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.less'],
  animations: [
    trigger('attack', [
      state('default', style({
        opacity: 0
      })),
      state('use', style({
        opacity: 0.8
      })),
      transition('default => use', animate('0.3s')),
      transition('use => default', animate('0.3s'))
    ]),
    trigger('turn', [
      state('disabled', style({
        opacity: 0.3
      })),
      state('enabled', style({
        opacity: 1
      })),
      transition('disabled => enabled', [
        animate('0.2s')
      ]),
      transition('enabled => disabled', [
        animate('0.3s')
      ])
    ])
  ]
})
export class FightComponent implements OnInit, OnDestroy {
  allies: User[] = [];
  enemies: User[] = [];
  private dialog: DynamicDialogRef;
  boss: Boss;
  @ViewChild('alliesContainer', {read: ViewContainerRef}) alliesContainer;
  @ViewChild('enemiesContainer', {read: ViewContainerRef}) enemiesContainer;
  fightersElements: { [key: string]: HTMLElement } = {};
  statsElements: { [key: string]: HTMLElement } = {};
  skills: string[] = [];
  parent = this.injector.get(MainComponent);
  loaded = false;
  type: string;
  private stompClient;
  id: number;
  selectedSpell = 'Physical attack';
  map: { [key: string]: string } = {};
  used = 'physical';
  timer: number;
  current: string;
  kek = false;

  constructor(private router: Router, private transl: TranslatePipe,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService, private fightService: FightService,
              private resolver: ComponentFactoryResolver, private http: HttpClient,
              private injector: Injector, private endServ: FightEndService) {
  }

  ngOnInit() {
    this.initializeWebSockets();
    if (!this.fightService.valuesSet) {
      const url = this.parent.router.url;
      this.id = Number.parseInt(url.substring(11), 10);
      this.type = url.substring(7, 10);
    } else {
      this.id = this.fightService.id;
      this.type = this.fightService.type;
    }
    this.getFightInfo(this.type);
  }

  initializeWebSockets() {
    const ws = new SockJS('http://localhost:31480/socket');
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/user/fightState', (response) => {
        const fightState = <{
          attacker: string,
          target: string,
          attackName: string,
          chakraCost: number,
          damage: number,
          chakraBurn: number,
          deadly: boolean,
          everyoneDead: boolean,
          nextAttacker: string
        }>JSON.parse(response.body);
        that.used = fightState.attackName.substring(0, fightState.attackName.indexOf(' ')).toLowerCase();
        that.kek = true;
        setTimeout(() => {
          that.kek = false;
        }, 800);
        that.setTimer(fightState.nextAttacker, 30200);
        console.log(state);
        let attacker: User;
        let target: User;
        if (that.enemies.map(us => us.login).includes(fightState.attacker)) {
          attacker = that.enemies.find(us => us.login === fightState.attacker);
          target = that.allies.find(us => us.login === fightState.target);
        } else if (that.allies.map(us => us.login).includes(fightState.attacker)) {
          target = that.enemies.find(us => us.login === fightState.target);
          attacker = that.allies.find(us => us.login === fightState.attacker);
        }
        target.character.currentHP -= fightState.damage;
        target.character.currentChakra -= fightState.chakraBurn;
        attacker.character.currentChakra -= fightState.chakraCost;
        that.setChakraPercent(that.statsElements[fightState.attacker],
          attacker.character.currentChakra / attacker.character.maxChakra * 100);
        that.setHPPercent(that.statsElements[fightState.target],
          target.character.currentHP / target.character.maxHp * 100);
        that.setChakraPercent(that.statsElements[fightState.target],
          target.character.currentChakra / target.character.maxChakra * 100);
        if (fightState.deadly) {
          that.setDead(target);
          if (fightState.everyoneDead) {
            let victory: boolean;
            let loss: boolean;
            if (that.allies.map(us => us.login).includes(target.login)) {
              victory = false;
              loss = true;
            } else {
              victory = true;
              loss = false;
            }
            that.finishFight(false, victory, loss);
          }
        }
      });
      that.stompClient.subscribe('/user/switch', (response) => {
        that.setTimer(response.body, 30000);
      });
    });
  }

  init() {
    const factory = this.resolver.resolveComponentFactory(CharacterComponent);
    let character: ComponentRef<CharacterComponent>;
    console.log(this.allies);
    for (let i = 0; i < this.allies.length; i++) {
      character = this.alliesContainer.createComponent(factory);
      const genderId = this.allies[this.allies.length - i - 1].character.appearance.gender === 'FEMALE' ? 1 : 0;
      const element = (<HTMLElement>(<HTMLElement>character.location.nativeElement).childNodes[1 + genderId]);
      this.fightersElements[this.allies[this.allies.length - i - 1].login] = element;
      element.style.display = 'block';
      this.setPosition(element, i);
      (<HTMLElement>(<HTMLElement>character.location.nativeElement)
        .childNodes[1 + (genderId + 1) % 2]).style.display = 'none';
      const stats = (<HTMLElement>(<HTMLElement>character.location.nativeElement).childNodes[0]);
      this.statsElements[this.allies[this.allies.length - i - 1].login] = stats;
      this.setHPPercent(stats,
        this.enemies[0].character.currentHP / this.enemies[0].character.maxHp * 100);
      this.setChakraPercent(stats,
        this.enemies[0].character.currentChakra / this.enemies[0].character.maxChakra * 100);
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
      this.fightersElements[this.enemies[0].login] = element;
      element.style.display = 'block';
      element.classList.add('enemy');
      (<HTMLElement>(<HTMLElement>character.location.nativeElement)
        .childNodes[1 + (genderId + 1) % 2]).style.display = 'none';
      console.log(element);
      this.setAppearance(element, this.enemies[0]);
      const stats = (<HTMLElement>(<HTMLElement>character.location.nativeElement).childNodes[0]);
      this.statsElements[this.enemies[0].login] = stats;
      this.setHPPercent(stats,
        this.enemies[0].character.currentHP / this.enemies[0].character.maxHp * 100);
      this.setChakraPercent(stats,
        this.enemies[0].character.currentChakra / this.enemies[0].character.maxChakra * 100);
      const login = this.enemies[0].login;
      (<HTMLElement>stats
        .getElementsByClassName('name')[0])
        .innerText = login;
      element.addEventListener('click', () => {
        this.attack(login);
      });
    }
  }

  getFightInfo(type: string) {
    if (type.toLowerCase() === 'pvp') {
    this.http.post('http://localhost:31480/fight/info', null, {
      withCredentials: true,
      params: new HttpParams().append('id', this.id.toString())
    }).subscribe((data: {
      id: number, type: string,
      fighters1: User, fighters2: User,
      currentName: string, timeLeft: number
    }) => {
      this.setTimer(data.currentName, data.timeLeft);
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
  } else {
    this.http.post('http://localhost:31480/fight/infoPVE', null, {
      withCredentials: true,
      params: new HttpParams().append('id', this.id.toString())
    }).subscribe((data: {
      id: number, type:string, fighters: User[], currentName: string, timeLeft: number,
      boss: Boss
    }) => {
      this.setTimer(data.currentName, data.timeLeft);
      this.allies = data.fighters;
      this.boss = data.boss;
      const spells = data.fighters.find(us => us.login === this.parent.login).character.spellsKnown;
      this.skills.push('Physical attack');
      this.map['Physical attack'] = 'Physical attack\n' +
        'Damage: ' + data.fighters.find(us => us.login === this.parent.login).character.physicalDamage + '\nChakra: 0';
      spells.forEach((it) => {
        this.skills.push(it.spellUse.name);
        this.map[it.spellUse.name] = it.spellUse.name +
          '\nDamage: ' + (it.spellUse.baseDamage) + '\nChakra: ' + it.spellUse.baseChakraConsumption;
      });
      this.loaded = true;
      this.init(); 
    });
  }
  }

  setTimer(currentName: string, timeLeft: number) {
    clearInterval(this.timer);
    this.current = currentName;
    if (currentName === this.parent.login) {
      currentName = 'Your turn!';
    } else {
      if (currentName === '') {
        currentName = 'Prepare!';
      } else {
        currentName = currentName + '\'s turn!';
      }
    }
    document.getElementById('current').innerText = currentName;
    this.timer = setInterval(() => {
      timeLeft -= 1000;
      document.getElementById('timer').innerText = (timeLeft / 1000).toFixed(0);
    }, 1000);
  }

  attack(enemy: string): any {
    if (this.current !== this.parent.login) {
      return;
    }
    this.kek = true;
    this.used = this.selectedSpell.substring(0, this.selectedSpell.indexOf(' ')).toLowerCase();
    console.log('Used: ' + this.used);
    setTimeout(() => {
      this.kek = false;
    }, 800);
    const self: User = this.allies.find(all => all.login === this.parent.login);
    if (this.selectedSpell === 'Air Strike' &&
      self.character.currentChakra <
      (70 + 10 * self.character.spellsKnown
        .find(sh => sh.spellUse.name === 'Air Strike').spellLevel) ||
      this.selectedSpell === 'Fire Strike' &&
      self.character.currentChakra <
      (40 + 5 * self.character.spellsKnown
        .find(sh => sh.spellUse.name === 'Fire Strike').spellLevel) ||
      this.selectedSpell === 'Water Strike' &&
      self.character.currentChakra <
      (20 + 4 * self.character.spellsKnown
        .find(sh => sh.spellUse.name === 'Water Strike').spellLevel) ||
      this.selectedSpell === 'Earth Strike' &&
      self.character.currentChakra <
      (12 + 3 * self.character.spellsKnown
        .find(sh => sh.spellUse.name === 'Earth Strike').spellLevel)) {
      this.selectedSpell = 'Physical attack';
    }
    this.http.post('http://localhost:31480/fight/attack', null, {
      withCredentials: true,
      params: new HttpParams()
        .append('fightId', this.id.toString())
        .append('enemy', enemy)
        .append('spellName', this.selectedSpell)
    }).subscribe((data: {
      damage: number,
      chakra: number,
      deadly: boolean,
      code: number
    }) => {
    }, () => {
    });
  }

  selectSpell(event: MouseEvent) {
    if (this.current === this.parent.login) {
      const self: User = this.allies.find(all => all.login === this.parent.login);
      if (event.srcElement.id === 'Air Strike' &&
        self.character.currentChakra <
        (70 + 10 * self.character.spellsKnown
          .find(sh => sh.spellUse.name === 'Air Strike').spellLevel) ||
        event.srcElement.id === 'Fire Strike' &&
        self.character.currentChakra <
        (40 + 5 * self.character.spellsKnown
          .find(sh => sh.spellUse.name === 'Fire Strike').spellLevel) ||
        event.srcElement.id === 'Water Strike' &&
        self.character.currentChakra <
        (20 + 4 * self.character.spellsKnown
          .find(sh => sh.spellUse.name === 'Water Strike').spellLevel) ||
        event.srcElement.id === 'Earth Strike' &&
        self.character.currentChakra <
        (12 + 3 * self.character.spellsKnown
          .find(sh => sh.spellUse.name === 'Earth Strike').spellLevel)) {
        alert(this.transl.transform('Not enough chakra'));
        this.selectedSpell = 'Physical attack';
      } else {
        this.selectedSpell = event.srcElement.id;
      }
    } else {
      alert(this.transl.transform('Not your turn!'));
    }

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

  setDead(user: User): void {
    console.log(user.login + ' has perished.');
  }

  finishFight(death: boolean, victory: boolean, loss: boolean): void {
    this.endServ.death = death;
    this.endServ.loss = loss;
    this.endServ.victory = victory;
    this.dialog = this.dialogService.open(FightResultComponent, {
      width: '400px', height: '160px'
    });
    this.router.navigateByUrl('/profile');
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

}
