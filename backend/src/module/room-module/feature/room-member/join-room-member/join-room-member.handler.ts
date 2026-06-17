import { BadRequestException, Injectable } from "@nestjs/common";
import { JoinRoomMemberDto } from "./join-room-member.dto";
import type { Request } from "express";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/common/infrastruture/socket/socket.enum";
import { OutboxRepository } from "src/module/room-module/infrastructure/repository/outbox.repository";
import { RoomMemberEntity } from "src/module/room-module/domain/room-member/room-member.entity";
import { RoomMemberPublishEventEnum } from "src/module/room-module/domain/room-member/room-member-event.entity";

@Injectable()
export class JoinRoomMemberService {
    private readonly ROOM_EXCHANGE = 'room.exchange';

    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, body: JoinRoomMemberDto) {
        const isRoomExists = await this.roomRepository.findByUuid(body.room_uuid);
        if (!isRoomExists) {
            throw new BadRequestException("Room Not Found");
        }

        const isRoomMemberExists = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid, body.room_uuid);
        if (isRoomMemberExists) {
            throw new BadRequestException("Already Member of Room");
        }

        await this.roomMemberRepository.createRoomMember({ ...body, user_uuid: req.user.uuid });
        const newMember = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid, body.room_uuid);
        if (isRoomMemberExists) {
            throw new BadRequestException("Already Member of Room");
        }

        await this.outboxRepository.createOutboxEntry({
            exchange_name: this.ROOM_EXCHANGE,
            routing_key: '',
            event_name: RoomMemberPublishEventEnum.ROOM_MEMBER_CREATED,
            message_payload: newMember as RoomMemberEntity,
        });

        await this.socketService.emitToUser(req.user.uuid, SocketEventNameEnum.ROOM_MEMBER_CREATED, isRoomExists);
        return;
    }
}