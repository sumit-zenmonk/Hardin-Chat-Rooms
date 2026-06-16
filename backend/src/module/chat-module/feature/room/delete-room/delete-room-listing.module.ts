import { Module } from "@nestjs/common";
import { DeleteRoomController } from "./delete-room-listing.controller";
import { DeleteRoomService } from "./delete-room-listing.handler";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";

@Module({
    imports: [],
    controllers: [DeleteRoomController],
    providers: [DeleteRoomService, RoomRepository],
    exports: [],
})

export class DeleteRoomModule { }