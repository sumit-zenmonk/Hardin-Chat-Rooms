import { Module } from "@nestjs/common";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";
import { CreateChatController } from "./create-chat.controller";
import { CreateChatService } from "./create-chat.handler";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";

@Module({
    imports: [],
    controllers: [CreateChatController],
    providers: [CreateChatService, RoomRepository, RoomMemberRepository, RoomChatRepository],
    exports: [],
})

export class CreateChatModule { }