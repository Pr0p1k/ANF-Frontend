import {Appearance} from './appearance';
import { SpellHandling } from './spell-handling';

export class Character {

    animalRace: string;
    cretionDate: Date;
    appearance: Appearance;
    maxChakra: number;
    maxHp: number;
    physicalDamage: number;
    resistance: number;
    spellsKnown: SpellHandling[];

}
