import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}
  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      userId,
      userIds: createChatInput.userIds || [],
      name: createChatInput.name,
      messages: [],
    });
  }

  async findAll(userId: string) {
    return this.chatsRepository.find({
      ...this.userChatFilter(userId),
    });
  }

  async findOne(_id: string) {
    return this.chatsRepository.findOne({ _id });
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

  userChatFilter(userId: string) {
    return {
      $or: [
        { userId }, // if current user is chat owner
        {
          userIds: {
            $in: [userId], // if current user is a participant
          },
        },
        { isPrivate: true },
      ],
    };
  }
}
