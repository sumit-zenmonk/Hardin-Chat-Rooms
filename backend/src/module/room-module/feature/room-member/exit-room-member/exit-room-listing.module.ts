import { Module } from "@nestjs/common";
import { ExitRoomMemberController } from "./exit-room-listing.controller";
import { ExitRoomMemberService } from "./exit-room-listing.handler";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";
import { OutboxRepository } from "src/module/room-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [ExitRoomMemberController],
    providers: [ExitRoomMemberService, RoomMemberRepository, OutboxRepository],
    exports: [],
})

export class ExitRoomMemberModule { }