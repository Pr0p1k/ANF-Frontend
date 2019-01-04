export class ChatMessage {
    author: string;
    text: string;
    constructor(auth: string, txt: string){
        this.author = auth;
        this.text = txt;
    }
}
