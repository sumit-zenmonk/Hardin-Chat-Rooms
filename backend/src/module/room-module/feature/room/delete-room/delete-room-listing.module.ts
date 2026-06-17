import { Module } from "@nestjs/common";
import { DeleteRoomController } from "./delete-room-listing.controller";
import { DeleteRoomService } from "./delete-room-listing.handler";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";
import { OutboxRepository } from "src/module/room-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [DeleteRoomController],
    providers: [DeleteRoomService, RoomRepository, OutboxRepository],
    exports: [],
})

export class DeleteRoomModule { }