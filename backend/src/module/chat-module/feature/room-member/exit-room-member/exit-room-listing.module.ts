import { Module } from "@nestjs/common";
import { ExitRoomMemberController } from "./exit-room-listing.controller";
import { ExitRoomMemberService } from "./exit-room-listing.handler";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";

@Module({
    imports: [],
    controllers: [ExitRoomMemberController],
    providers: [ExitRoomMemberService, RoomMemberRepository],
    exports: [],
})

export class ExitRoomMemberModule { }