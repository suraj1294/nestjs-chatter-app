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

  async findAll() {
    return this.chatsRepository.find({});
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
}
