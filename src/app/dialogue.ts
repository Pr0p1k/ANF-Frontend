import {Message} from './message';
import {User} from './user';

export class Dialogue {

    userReader: User;
    userNotReader: User;
    messagesFromReader: Message[];
    messagesToReader: Message[];
    unreadMsgNum: number;

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

    public setUnreadMsgNum (num: number): void {
        this.unreadMsgNum = num;
    }

    public clearUnreadMsgNum (): void {
        this.unreadMsgNum = 0;
    }

}
