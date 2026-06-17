import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomMemberDto } from "./create-room-member.dto";
import type { Request } from "express";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/common/infrastruture/socket/socket.enum";

@Injectable()
export class CreateRoomMemberService {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, body: CreateRoomMemberDto) {
        const isRoomExists = await this.roomRepository.findByUuid(body.room_uuid);
        if (!isRoomExists) {
            throw new BadRequestException("Room Not Found");
        }

        const isRoomMemberExists = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid, body.room_uuid);
        if (isRoomMemberExists) {
            throw new BadRequestException("Already Member of Room");
        }

        await this.roomMemberRepository.createRoomMember({ ...body, user_uuid: req.user.uuid });

        await this.socketService.emitToUser(req.user.uuid, SocketEventNameEnum.ROOM_MEMBER_CREATED, isRoomExists);
        return;
    }
}