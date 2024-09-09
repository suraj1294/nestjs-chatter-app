import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ChatsRepository } from './chats.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { Chat, ChatSchema } from './entities/chat.entity';
import { MessagesModule } from './messages/messages.module';
import { PubSubModule } from 'src/common/pubsub/pubsub.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => MessagesModule),
    PubSubModule,
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
  exports: [ChatsRepository, ChatsService],
})
export class ChatsModule {}
