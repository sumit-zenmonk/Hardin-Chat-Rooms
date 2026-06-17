import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";

@Injectable()
export class DeleteRoomChatService {
    constructor(
        private readonly repository: RoomChatRepository,
    ) { }

    async handle(req: Request, uuid: string) {
        const isRoomChatExists = await this.repository.findByUuid(uuid);
        if (!isRoomChatExists) {
            throw new BadRequestException("Room Chat Not Found");
        }
        if (isRoomChatExists.member.user_uuid == req.user.uuid) {
            throw new BadRequestException("Can't delete other's chat");
        }

        await this.repository.deleteRoomChat(uuid);
        return;
    }
}