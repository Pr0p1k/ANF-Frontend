import {Stats} from './stats';
import {Message} from './message';
import {Character} from './character';
import {FriendsRequest} from './friends-request';

export class User {

  login: string;
  character: Character;
  stats: Stats;
  incomingMessages: Message[];
  outgoingMessages: Message[];
  roles: string[];
  friendRequestsIn: FriendsRequest[];
  friendRequestsOut: FriendsRequest[];
  online: boolean;
  offline: boolean;


  setOnline(): void {
    this.online = true;
    this.offline = false;
  }

  setOffline(): void {
    this.online = false;
    this.offline = false;
  }

}
