import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";

@Injectable()
export class DeleteRoomService {
    constructor(
        private readonly repository: RoomRepository,
    ) { }

    async handle(req: Request, uuid: string) {
        const isRoomExists = await this.repository.findByCreatorUuidAndUuid(req.user.uuid, uuid);
        if (!isRoomExists) {
            throw new BadRequestException("Room Not Found");
        }
        await this.repository.deleteRoom(uuid);
        return;
    }
}