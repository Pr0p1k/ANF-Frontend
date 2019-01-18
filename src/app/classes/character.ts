import {Appearance} from './appearance';
import {SpellHandling} from './spell-handling';
import {PVEFight} from './pvefight';
import {User} from './user';

export class Character {

  animalRace: string;
  cretionDate: Date;
  appearance: Appearance;
  maxChakra: number;
  maxHp: number;
  user: User;
  physicalDamage: number;
  resistance: number;
  spellsKnown: SpellHandling[];
  fights: PVEFight[];
  currentHP: number;
  currentChakra: number;
}
