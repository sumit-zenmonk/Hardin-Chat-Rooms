import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomDto } from "./create-room.dto";
import type { Request } from "express";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/common/infrastruture/socket/socket.enum";

@Injectable()
export class CreateRoomService {
    constructor(
        private readonly repository: RoomRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, body: CreateRoomDto) {
        const isRoomWithSameNameExists = await this.repository.findByCreatorUuidAndName(req.user.uuid, body.name);
        if (isRoomWithSameNameExists) {
            throw new BadRequestException("Room With Same Name Exists");
        }

        const room = await this.repository.createRoom({ ...body, creator_uuid: req.user.uuid });

        await this.socketService.emitToUser(req.user.uuid, SocketEventNameEnum.ROOM_CREATED, room);
        return;
    }
}