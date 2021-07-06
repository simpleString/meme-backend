import { Message } from 'src/chats/entities/message.entity';

export class ChatsWithMessagesDto {
  constructor(message: Message) {
    this.message = message;
  }

  chatId: string;
  userId: string;
  message: Message;
}
