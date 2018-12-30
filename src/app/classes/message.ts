import {User} from './user';

export class Message {

    message_id: number;
    receiver: User;
    sender: User;
    sendingDate: Date;
    message: string;
    isRead: boolean;

}
