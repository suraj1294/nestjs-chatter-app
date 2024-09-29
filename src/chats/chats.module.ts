import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ChatsRepository } from './chats.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { Chat } from './entities/chat.entity';
import { MessagesModule } from './messages/messages.module';
import { PubSubModule } from 'src/common/pubsub/pubsub.module';
import { ChatSchema } from './entities/chat.document';
import { ChatsController } from './chats.controller';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => MessagesModule),
    PubSubModule,
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
  exports: [ChatsRepository],
  controllers: [ChatsController],
})
export class ChatsModule {}
