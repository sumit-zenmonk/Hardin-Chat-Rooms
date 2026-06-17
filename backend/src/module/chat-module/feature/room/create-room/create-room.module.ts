import { Module } from "@nestjs/common";
import { CreateRoomController } from "./create-room.controller";
import { CreateRoomService } from "./create-room.handler";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";

@Module({
    imports: [],
    controllers: [CreateRoomController],
    providers: [CreateRoomService, RoomRepository, RoomMemberRepository],
    exports: [],
})

export class CreateRoomModule { }