import { Module } from "@nestjs/common";
import { CreateRoomMemberController } from "./create-room-member.controller";
import { CreateRoomMemberService } from "./create-room-member.handler";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";

@Module({
    imports: [],
    controllers: [CreateRoomMemberController],
    providers: [CreateRoomMemberService, RoomRepository, RoomMemberRepository],
    exports: [],
})

export class CreateRoomMemberModule { }