import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { ProcessorsService } from './processors.service';
import { ChatRabbitMQConsumerInitializer } from './rabbit-mq-consumer-initializer';
import { RegisterUserService } from '../../feature/user/register-user/register-user.handler';
import { UserRepository } from '../repository/user.repository';
import { InboxRepository } from '../repository/inbox.repository';
import { CreateRoomService } from '../../feature/room/create-room/create-room.handler';
import { RoomRepository } from '../repository/room.repository';
import { RoomMemberRepository } from '../repository/room-member.repository';
import { DeleteRoomService } from '../../feature/room/delete-room/delete-room.handler';
import { JoinRoomMemberService } from '../../feature/room/join-room-member/join-room-member.handler';

@Module({
    providers: [
        RabbitMQService,
        ChatRabbitMQConsumerInitializer,
        ProcessorsService,
        RegisterUserService,
        InboxRepository,
        UserRepository,
        CreateRoomService,
        RoomRepository,
        RoomMemberRepository,
        DeleteRoomService,
        JoinRoomMemberService,
    ],
    exports: [RabbitMQService, ProcessorsService],
})
export class ChatRabbitMQModule { }
