import { Injectable, Logger } from '@nestjs/common';
import { RoomEventHandlerMap, UserRegisteredMQEventPayload } from './rabbit-mq.type';
import { RegisterUserService } from 'src/module/room-module/feature/user/register-user/register-user.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ProcessorsService {
    constructor(
        private readonly registerUserService: RegisterUserService,
        private readonly inboxRepository: InboxRepository,
    ) { }
    private readonly logger = new Logger(ProcessorsService.name);

    // Map event names to handlers
    public eventHandlerMap: RoomEventHandlerMap = {
        'user.registered': [
            async function handleUserRegister(payload: UserRegisteredMQEventPayload) {
                // @ts-ignore
                await this.handleUserRegister(payload);
            },
        ]
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_ROOM_SCHEMA || 'room_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handlers = this.eventHandlerMap[eventName];
        if (!handlers || !handlers.length) {
            this.logger.debug(`No handler found for event: ${eventName} in Room Module`);
            return;
        }

        for (const handler of handlers) {
            const alreadyProcessed = await this.inboxRepository.findByOutboxUuidAndHandlerName(outbox_uuid, handler.name);
            if (alreadyProcessed) {
                this.logger.debug(`Duplicated event: ${eventName} in Room Module`);
                return;
            }
            await handler.call(this, payload, outbox_uuid, eventName);
            await this.inboxRepository.createEntry({ outbox_uuid, event_name: eventName, handler_name: handler.name });
        }
    }

    async handleUserRegister(payload: UserRegisteredMQEventPayload) {
        await this.registerUserService.handle(payload);
    }
}
