import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/common/infrastruture/socket/socket.enum";

@Injectable()
export class ExitRoomMemberService {
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, room_uuid: string) {
        const isRoomMemberExists = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid, room_uuid);
        if (!isRoomMemberExists) {
            throw new BadRequestException("Member Not Found");
        }

        if (req.user.uuid !== isRoomMemberExists.user_uuid) {
            throw new BadRequestException("Not Allowed to remove other member");
        }
        if (req.user.uuid === isRoomMemberExists.room.creator_uuid) {
            throw new BadRequestException("Creator can't be exit room");
        }

        await this.roomMemberRepository.deleteRoomMember(isRoomMemberExists.uuid);

        await this.socketService.emitToUser(req.user.uuid, SocketEventNameEnum.ROOM_MEMBER_DELETED, { room_uuid: room_uuid });
        return;
    }
}