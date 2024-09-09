import { Inject, Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message-input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';
import { MessageCreatedArgs } from './dto/message.created.args';
import { ChatsService } from '../chats.service';
import { GetMessagesArgs } from './dto/get-messages.args';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly chatsService: ChatsService,
  ) {}

  async createMessage({ chatId, content }: CreateMessageInput, userId: string) {
    const message: Message = {
      userId,
      content,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
      chatId,
    };

    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.chatsService.userChatFilter(userId),
      },
      {
        $push: {
          messages: message,
        },
      },
    );

    await this.pubSub.publish(MESSAGE_CREATED, {
      messageCreated: message,
    });

    return message;
  }

  async getChatMessages({ chatId }: GetMessagesArgs, userId: string) {
    return (
      await this.chatsRepository.findOne({
        _id: chatId,
        ...this.chatsService.userChatFilter(userId),
      })
    ).messages;
  }

  async messageCreated({ chatId }: MessageCreatedArgs, userId: string) {
    await this.chatsRepository.findOne({
      _id: chatId,
      ...this.chatsService.userChatFilter(userId),
    });

    return this.pubSub.asyncIterator(MESSAGE_CREATED);
  }
}
