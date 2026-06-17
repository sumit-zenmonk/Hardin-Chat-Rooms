import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { RoomChatEntity } from "../../domain/room-chat/room-chat.entity";

@Injectable()
export class RoomChatRepository extends Repository<RoomChatEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema')
        private readonly dataSource: DataSource,
    ) {
        super(RoomChatEntity, dataSource.createEntityManager());
    }

    async createRoomChat(body: Partial<RoomChatEntity>) {
        const chat = this.create(body);
        return await this.save(chat);
    }

    async findByUuid(uuid: string) {
        const chat = await this.findOne({
            where: {
                uuid: uuid
            },
            relations: {
                member: true,
                room: true
            }
        });
        return chat;
    }

    async deleteRoomChat(uuid: string) {
        await this.softDelete(uuid);
        return;
    }
}