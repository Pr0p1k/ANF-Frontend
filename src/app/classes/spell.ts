export class Spell {

    reqLevel: number;
    name: string;
    baseDamage: number;
    damagePerLevel: number;
    baseChakraConsumption: number;
    chakraConsumptionPerLevel: number;

    constructor(lvl: number, name: string, baseDmg: number, baseChkr: number,
        dmgPerLvl: number, chkrPerLvl: number) {
            this.baseChakraConsumption = baseChkr;
            this.baseDamage = baseDmg;
            this.chakraConsumptionPerLevel = chkrPerLvl;
            this.damagePerLevel = dmgPerLvl;
            this.name = name;
            this.reqLevel = lvl;
        }

}
