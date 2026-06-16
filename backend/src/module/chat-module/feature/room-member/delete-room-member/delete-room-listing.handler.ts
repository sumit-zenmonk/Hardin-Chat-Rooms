import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";

@Injectable()
export class DeleteRoomMemberService {
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
    ) { }

    async handle(req: Request, uuid: string) {
        const isRoomMemberExists = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid,uuid);
        if (!isRoomMemberExists) {
            throw new BadRequestException("Member Not Found");
        }

        if (req.user.uuid != isRoomMemberExists.user_uuid) {
            throw new BadRequestException("Not Allowed to remove other member");
        }

        await this.roomMemberRepository.deleteRoomMember(isRoomMemberExists.uuid);
        return;
    }
}