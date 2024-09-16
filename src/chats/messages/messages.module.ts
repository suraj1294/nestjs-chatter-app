import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { ChatsModule } from '../chats.module';
import { PubSubModule } from 'src/common/pubsub/pubsub.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [forwardRef(() => ChatsModule), PubSubModule, UsersModule],
  providers: [MessagesResolver, MessagesService, UsersService],
})
export class MessagesModule {}
