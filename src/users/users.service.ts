import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  async create(createUserInput: CreateUserInput) {
    return this.userRepository.create({
      ...createUserInput,
      password: await this.hashPassword(createUserInput.password),
    });
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  findAll() {
    return this.userRepository.find({});
  }

  findOne(_id: string) {
    return this.userRepository.findOne({ _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(
        updateUserInput.password,
      );
    }

    return this.userRepository.findOneAndUpdate(
      { _id },
      {
        $set: {
          ...updateUserInput,
        },
      },
    );
  }

  remove(_id: string) {
    return this.userRepository.findOneAndDelete({ _id });
  }
}
