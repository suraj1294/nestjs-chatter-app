import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { ChatsModule } from '../chats.module';
import { PubSubModule } from 'src/common/pubsub/pubsub.module';

@Module({
  imports: [forwardRef(() => ChatsModule), PubSubModule],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
