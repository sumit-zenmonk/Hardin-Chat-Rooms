import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { EventHandlerMapService } from './event-handler.map.service';
import { ChatRabbitMQConsumerInitializer } from './rabbit-mq-consumer-initializer';
import { RegisterUserService } from '../../feature/user/register-user/register-user.handler';
import { UserRepository } from '../repository/user.repository';
import { InboxRepository } from '../repository/inbox.repository';

@Module({
    providers: [
        RabbitMQService,
        ChatRabbitMQConsumerInitializer,
        EventHandlerMapService,
        RegisterUserService,
        InboxRepository,
        UserRepository,
    ],
    exports: [RabbitMQService, EventHandlerMapService],
})
export class ChatRabbitMQModule { }
