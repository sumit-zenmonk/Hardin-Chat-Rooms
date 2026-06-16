import { Module } from "@nestjs/common";
import { DeleteRoomMemberController } from "./delete-room-listing.controller";
import { DeleteRoomMemberService } from "./delete-room-listing.handler";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";

@Module({
    imports: [],
    controllers: [DeleteRoomMemberController],
    providers: [DeleteRoomMemberService, RoomMemberRepository],
    exports: [],
})

export class DeleteRoomMemberModule { }