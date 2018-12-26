import {Message} from './message';
import {User} from './user';

export class Dialogue {

    userReader: User;
    userNotReader: User;
    messagesFromReader: Message[];
    messagesToReader: Message[];

    public addNew(msg: Message):void {
        if (msg.sender === this.userReader.login)
            this.messagesFromReader.push(msg);
        else
            this.messagesToReader.push(msg);
    }

    public delete(msg: Message):void {
        if (msg.sender === this.userReader.login)
            this.messagesFromReader.splice(this.messagesFromReader.indexOf(msg), 1);
        else
            this.messagesToReader.splice(this.messagesToReader.indexOf(msg), 1);
    }

}
