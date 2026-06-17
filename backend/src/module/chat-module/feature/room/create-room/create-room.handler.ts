import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomDto } from "./create-room.dto";
import type { Request } from "express";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/common/infrastruture/socket/socket.enum";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";
import { RoomMemberRole } from "src/module/chat-module/domain/room-member/room-member.enum";

@Injectable()
export class CreateRoomService {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, body: CreateRoomDto) {
        const isRoomWithSameNameExists = await this.roomRepository.findByCreatorUuidAndName(req.user.uuid, body.name);
        if (isRoomWithSameNameExists) {
            throw new BadRequestException("Room With Same Name Exists");
        }

        const newRoom = await this.roomRepository.createRoom({ ...body, creator_uuid: req.user.uuid });
        await this.roomMemberRepository.createRoomMember({ role: RoomMemberRole.CREATOR, room_uuid: newRoom.uuid, user_uuid: req.user.uuid });
        const room =await this.roomRepository.findByUuid(newRoom.uuid);

        await this.socketService.emitToUser(req.user.uuid, SocketEventNameEnum.ROOM_CREATED, room);
        return;
    }
}