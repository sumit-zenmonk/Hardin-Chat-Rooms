import { Module } from "@nestjs/common";
import { JoinRoomMemberController } from "./join-room-member.controller";
import { JoinRoomMemberService } from "./join-room-member.handler";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";

@Module({
    imports: [],
    controllers: [JoinRoomMemberController],
    providers: [JoinRoomMemberService, RoomRepository, RoomMemberRepository],
    exports: [],
})

export class JoinRoomMemberModule { }