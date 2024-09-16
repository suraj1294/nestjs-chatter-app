import { Inject, Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message-input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';
import { GetMessagesArgs } from './dto/get-messages.args';
import { MessageDocument } from './entities/message.document';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly userService: UsersService,
  ) {}

  async createMessage({ chatId, content }: CreateMessageInput, userId: string) {
    const messageDocument: MessageDocument = {
      userId: new Types.ObjectId(userId),
      content,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };

    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        $push: {
          messages: messageDocument,
        },
      },
    );

    const message: Message = {
      ...messageDocument,
      chatId,
      user: await this.userService.findOne(userId),
    };

    await this.pubSub.publish(MESSAGE_CREATED, {
      messageCreated: message,
    });

    return message;
  }

  async getChatMessages({ chatId }: GetMessagesArgs) {
    return this.chatsRepository.model.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(chatId),
        },
      },
      {
        $unwind: '$messages',
      },
      {
        $replaceRoot: {
          newRoot: '$messages',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $unset: ['userId'],
      },
      {
        $set: { chatId },
      },
    ]);

    // return (
    //   await this.chatsRepository.findOne({
    //     _id: chatId,
    //   })
    // ).messages;
  }

  async messageCreated() {
    // await this.chatsRepository.findOne({
    //   _id: chatId,
    // });

    return this.pubSub.asyncIterator(MESSAGE_CREATED);
  }
}
