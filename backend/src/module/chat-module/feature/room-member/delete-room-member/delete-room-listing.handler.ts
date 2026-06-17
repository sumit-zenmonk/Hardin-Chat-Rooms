import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/common/infrastruture/socket/socket.enum";

@Injectable()
export class DeleteRoomMemberService {
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, uuid: string) {
        const isRoomMemberExists = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid, uuid);
        if (!isRoomMemberExists) {
            throw new BadRequestException("Member Not Found");
        }

        if (req.user.uuid != isRoomMemberExists.user_uuid) {
            throw new BadRequestException("Not Allowed to remove other member");
        }

        await this.roomMemberRepository.deleteRoomMember(isRoomMemberExists.uuid);

        await this.socketService.emitToUser(req.user.uuid, SocketEventNameEnum.ROOM_MEMBER_DELETED, { room_uuid: uuid });
        return;
    }
}