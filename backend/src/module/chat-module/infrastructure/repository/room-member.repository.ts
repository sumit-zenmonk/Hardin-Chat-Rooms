import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { RoomMemberEntity } from "../../domain/room-member/room-member.entity";

@Injectable()
export class RoomMemberRepository extends Repository<RoomMemberEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema')
        private readonly dataSource: DataSource,
    ) {
        super(RoomMemberEntity, dataSource.createEntityManager());
    }

    async createRoomMember(body: Partial<RoomMemberEntity>) {
        const member = this.create(body);
        return await this.save(member);
    }

    async findByUuid(uuid: string) {
        const member = await this.findOne({
            where: {
                uuid: uuid
            },
        });
        return member;
    }

    async findByUserUuidAndRoomUuid(user_uuid: string, room_uuid: string) {
        const member = await this.findOne({
            where: {
                user_uuid: user_uuid,
                room_uuid: room_uuid
            },
        });
        return member;
    }

    async deleteRoomMember(uuid: string) {
        await this.softDelete(uuid);
        return;
    }
}