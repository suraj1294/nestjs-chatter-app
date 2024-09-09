import { Inject, Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message-input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
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
        ...this.userChatFilter(userId),
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

  async getChatMessages(chatId: string, userId: string) {
    return (
      await this.chatsRepository.findOne({
        _id: chatId,
        ...this.userChatFilter(userId),
      })
    ).messages;
  }

  private userChatFilter(userId: string) {
    return {
      $or: [
        { userId }, // if current user is chat owner
        {
          userIds: {
            $in: [userId], // if current user is a participant
          },
        },
      ],
    };
  }
}
