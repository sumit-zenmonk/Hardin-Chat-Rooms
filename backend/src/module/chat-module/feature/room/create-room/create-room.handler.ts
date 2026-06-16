import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomDto } from "./create-room.dto";
import type { Request } from "express";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";

@Injectable()
export class CreateRoomService {
    constructor(
        private readonly repository: RoomRepository,
    ) { }

    async handle(req: Request, body: CreateRoomDto) {
        const isRoomWithSameNameExists = await this.repository.findByCreatorUuidAndName(req.user.uuid, body.name);
        if (isRoomWithSameNameExists) {
            throw new BadRequestException("Room With Same Name Exists");
        }

        await this.repository.createRoom({ ...body, creator_uuid: req.user.uuid });
        return;
    }
}