import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomChatDto } from "./create-room-chat.dto";
import type { Request } from "express";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";
import { SocketEventNameEnum } from "src/common/infrastruture/socket/socket.enum";
import { SocketService } from "src/common/infrastruture/socket/socket.service";

@Injectable()
export class CreateRoomChatService {
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly roomChatRepository: RoomChatRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, body: CreateRoomChatDto) {
        const isRoomMemberExists = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid, body.room_uuid);
        if (!isRoomMemberExists) {
            throw new BadRequestException("Member not found");
        }

        const newChat = await this.roomChatRepository.createRoomChat(body);
        const chat = await this.roomChatRepository.findByUuid(newChat.uuid);

        await this.socketService.emitToUser(req.user.uuid, SocketEventNameEnum.ROOM_CHAT_CREATED, chat);
        return;
    }
}