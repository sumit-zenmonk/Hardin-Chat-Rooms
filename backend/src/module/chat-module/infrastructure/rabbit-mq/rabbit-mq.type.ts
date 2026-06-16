// Payload Types for Chat Module
export interface UserRegisteredMQEventPayload {
    uuid: string;
    name: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type ChatEventPayloadMap = {
    'user.registered': UserRegisteredMQEventPayload,
};

// Generic union type
export type ChatEventPayload = ChatEventPayloadMap[keyof ChatEventPayloadMap];

// 1. Define the Handler Function Type
export type EventHandlerFunction<T extends keyof ChatEventPayloadMap> =
    (payload: ChatEventPayloadMap[T]) => Promise<void>;

// 2. Map of exact handler signatures
export type ChatEventHandlerMap = {
    [K in keyof ChatEventPayloadMap]: EventHandlerFunction<K>[];
};