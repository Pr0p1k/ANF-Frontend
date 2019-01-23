import {Stats} from './stats';
import {Message} from './message';
import {Character} from './character';
import {FriendsRequest} from './friends-request';
import { Role } from './role';

export class User {

  login: string;
  character: Character;
  stats: Stats;
  incomingMessages: Message[];
  outgoingMessages: Message[];
  roles: Role[];
  email: string;
  friendRequestsIn: FriendsRequest[];
  friendRequestsOut: FriendsRequest[];
  online = false;
  offline = true;

}
