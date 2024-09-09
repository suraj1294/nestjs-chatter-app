import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateMessageInput } from './dto/create-message-input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { GetMessagesArgs } from './dto/get-messages.args';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MessageCreatedArgs } from './dto/message.created.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @CurrentUser() user: TokenPayload,
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ) {
    return this.messagesService.createMessage(createMessageInput, user._id);
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args() getMessagesArgs: GetMessagesArgs,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.getChatMessages(getMessagesArgs, user._id);
  }

  @Subscription(() => Message, {
    filter(payload, variables, context) {
      //payload is the new created message
      //variables in chatId mentioned in while
      //subscription on client side

      const userId = context.req.user._id;

      return (
        payload.messageCreated.chatId === variables.chatId &&
        payload.messageCreated.userId !== userId
      );
    },
  })
  async messageCreated(
    @Args() messageCreatedArgs: MessageCreatedArgs,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.messageCreated(messageCreatedArgs, user._id);
  }
}
