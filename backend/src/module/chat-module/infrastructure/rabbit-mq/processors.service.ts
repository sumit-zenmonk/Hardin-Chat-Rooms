import { Injectable, Logger } from '@nestjs/common';
import { ChatEventHandlerMap, RoomCreatedMQEventPayload, RoomDeletedMQEventPayload, UserRegisteredMQEventPayload } from './rabbit-mq.type';
import { RegisterUserService } from 'src/module/chat-module/feature/user/register-user/register-user.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';
import { CreateRoomService } from '../../feature/room/create-room/create-room.handler';
import { DeleteRoomService } from '../../feature/room/delete-room/delete-room.handler';

@Injectable()
export class ProcessorsService {
    constructor(
        private readonly registerUserService: RegisterUserService,
        private readonly createRoomService: CreateRoomService,
        private readonly deleteRoomService: DeleteRoomService,
        private readonly inboxRepository: InboxRepository,
    ) { }
    private readonly logger = new Logger(ProcessorsService.name);

    // Map event names to handlers
    public eventHandlerMap: ChatEventHandlerMap = {
        'user.registered': [
            async function handleUserRegister(payload: UserRegisteredMQEventPayload) {
                // @ts-ignore
                await this.handleUserRegister(payload);
            },
        ],
        'room.created': [
            async function handleRoomCreated(payload: RoomCreatedMQEventPayload) {
                // @ts-ignore
                await this.handleRoomCreated(payload);
            },
        ],
        'room.deleted': [
            async function handleRoomDeleted(payload: RoomDeletedMQEventPayload) {
                // @ts-ignore
                await this.handleRoomDeleted(payload);
            },
        ],
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handlers = this.eventHandlerMap[eventName];
        if (!handlers || !handlers.length) {
            this.logger.debug(`No handler found for event: ${eventName} in Chat Module`);
            return;
        }

        for (const handler of handlers) {
            const alreadyProcessed = await this.inboxRepository.findByOutboxUuidAndHandlerName(outbox_uuid, handler.name);
            if (alreadyProcessed) {
                this.logger.debug(`Duplicated event: ${eventName} in Chat Module`);
                return;
            }
            await handler.call(this, payload, outbox_uuid, eventName);
            await this.inboxRepository.createEntry({ outbox_uuid, event_name: eventName, handler_name: handler.name });
        }
    }

    async handleUserRegister(payload: UserRegisteredMQEventPayload) {
        await this.registerUserService.handle(payload);
    }

    async handleRoomCreated(payload: RoomCreatedMQEventPayload) {
        await this.createRoomService.handle(payload);
    }

    async handleRoomDeleted(payload: RoomDeletedMQEventPayload) {
        await this.deleteRoomService.handle(payload);
    }
}
