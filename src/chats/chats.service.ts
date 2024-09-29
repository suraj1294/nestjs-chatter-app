import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';
import { PipelineStage, Types } from 'mongoose';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}
  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      userId,
      messages: [],
    });
  }

  async chatCount() {
    return this.chatsRepository.model.countDocuments({});
  }

  async findMany(
    prePipelineStages: PipelineStage[] = [],
    paginationArgs: PaginationArgs = { skip: 0, limit: 10 },
  ) {
    const chats = await this.chatsRepository.model.aggregate([
      ...prePipelineStages,
      {
        $set: {
          latestMessage: {
            $cond: [
              '$messages',
              { $arrayElemAt: ['$messages', -1] },
              {
                createdAt: new Date(),
              },
            ],
          },
        },
      },
      {
        $sort: {
          'latestMessage.createdAt': -1,
        },
      },
      {
        $skip: paginationArgs.skip,
      },
      {
        $limit: paginationArgs.limit,
      },
      {
        $unset: ['messages'],
      },
      {
        $lookup: {
          from: 'users',
          localField: 'latestMessage.userId',
          foreignField: '_id',
          as: 'latestMessage.user',
        },
      },
    ]);

    chats.forEach((chat) => {
      if (!chat.latestMessage?._id) {
        delete chat.latestMessage;
        return;
      }
      chat.latestMessage.user = chat.latestMessage.user[0];
      delete chat.latestMessage.userId;
      chat.latestMessage.chatId = chat._id;
    });

    return chats;
  }

  async findOne(_id: string) {
    const chats = await this.findMany([
      {
        $match: {
          _id: new Types.ObjectId(_id),
        },
      },
    ]);

    if (!chats[0]) {
      throw new NotFoundException('Chat not found with id: ' + _id);
    }

    return chats[0];
  }

  update(_id: string, updateChatInput: Omit<UpdateChatInput, '_id'>) {
    return this.chatsRepository.findOneAndUpdate(
      { _id },
      {
        $set: {
          ...updateChatInput,
        },
      },
    );
  }

  remove(_id: string) {
    return this.chatsRepository.findOneAndDelete({ _id });
  }

  // userChatFilter(userId: string) {
  //   return {
  //     $or: [
  //       { userId }, // if current user is chat owner
  //       {
  //         userIds: {
  //           $in: [userId], // if current user is a participant
  //         },
  //       },
  //       { isPrivate: true },
  //     ],
  //   };
  // }
}
