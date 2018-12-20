import { Stats } from './stats'
import { Message } from './message'
import { Character } from './character'
import { FriendsRequest } from './friends-request'

export class User {

    username: string;
    stats: Stats;
    inMessages: Message[];
    outMessages: Message[];
    character: Character;
    role: string[];
    inRequests: FriendsRequest[];
    outRequests: FriendsRequest[];

}
