import { Injectable, Logger } from '@nestjs/common';
import { ChatEventHandlerMap, UserRegisteredMQEventPayload } from './rabbit-mq.type';
import { RegisterUserService } from 'src/module/chat-module/feature/user/register-user/register-user.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EventHandlerMapService {
    constructor(
        private readonly registerUserService: RegisterUserService,
        private readonly inboxRepository: InboxRepository,
    ) { }
    private readonly logger = new Logger(EventHandlerMapService.name);

    // Map event names to handlers
    public eventHandlerMap: ChatEventHandlerMap = {
        'user.registered': [
            (payload: UserRegisteredMQEventPayload) => this.handleUserRegister(payload),
        ]
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
            await handler(payload, outbox_uuid, eventName);
            await this.inboxRepository.createEntry({ outbox_uuid, event_name: eventName, handler_name: handler.name });
        }
    }

    async handleUserRegister(payload: UserRegisteredMQEventPayload) {
        await this.registerUserService.handle(payload);
    }
}
