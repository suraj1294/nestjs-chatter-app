import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateMessageInput } from './dto/create-message-input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { GetMessagesArgs } from './dto/get-messages.args';

import { MessageCreatedArgs } from './dto/message.created.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @CurrentUser() user: TokenPayload,
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ): Promise<Message> {
    return this.messagesService.createMessage(createMessageInput, user._id);
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args() getMessagesArgs: GetMessagesArgs,
  ): Promise<Message[]> {
    return this.messagesService.getChatMessages(getMessagesArgs);
  }

  @Subscription(() => Message, {
    filter(payload, variables: MessageCreatedArgs, context) {
      //payload is the new created message
      //variables in chatId mentioned in while
      //subscription on client side

      const userId = context.req.user._id;
      const message: Message = payload.messageCreated;

      return (
        variables.chatIds.includes(message.chatId) &&
        message.user._id.toHexString() !== userId
      );
    },
  })
  async messageCreated(@Args() _messageCreatedArgs: MessageCreatedArgs) {
    console.log('messageCreated', _messageCreatedArgs);
    return this.messagesService.messageCreated();
  }
}
