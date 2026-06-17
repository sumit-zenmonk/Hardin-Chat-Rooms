import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/common/infrastruture/socket/socket.enum";

@Injectable()
export class DeleteRoomService {
    constructor(
        private readonly repository: RoomRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, uuid: string) {
        const isRoomExists = await this.repository.findByCreatorUuidAndUuid(req.user.uuid, uuid);
        if (!isRoomExists) {
            throw new BadRequestException("Room Not Found");
        }
        await this.repository.deleteRoom(uuid);

        await this.socketService.emitToUser(req.user.uuid, SocketEventNameEnum.ROOM_DELETED, { uuid });
        return;
    }
}