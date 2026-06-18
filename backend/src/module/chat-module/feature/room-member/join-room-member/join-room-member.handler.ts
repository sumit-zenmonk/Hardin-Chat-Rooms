import { BadRequestException, Injectable } from "@nestjs/common";
import { RoomMemberCreatedMQEventPayload } from "src/module/chat-module/infrastructure/rabbit-mq/rabbit-mq.type";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";

@Injectable()
export class JoinRoomMemberService {
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
    ) { }

    async handle(body: RoomMemberCreatedMQEventPayload) {
        let data = body as any;

        const isEligilbleForWriter = await this.roomMemberRepository.findTopWriters(body.room_uuid);
        if (isEligilbleForWriter.length <= Number(process.env.WRITER_ALLOWED_LIMIT) || 10) {
            data = { ...data, is_writer: true };
        }

        await this.roomMemberRepository.createRoomMember({ ...body });
        return;
    }
}