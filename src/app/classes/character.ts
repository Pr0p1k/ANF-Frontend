import {Appearance} from './appearance';
import { SpellHandling } from './spell-handling';
import { PVEFight } from './pvefight';

export class Character {

    animalRace: string;
    cretionDate: Date;
    appearance: Appearance;
    maxChakra: number;
    maxHp: number;
    physicalDamage: number;
    resistance: number;
    spellsKnown: SpellHandling[];
    fights: PVEFight[];

}
