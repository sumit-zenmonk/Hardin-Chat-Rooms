// Payload Types for Room Module
export interface UserRegisteredMQEventPayload {
    uuid: string;
    name: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type RoomEventPayloadMap = {
    'user.registered': UserRegisteredMQEventPayload,
};

// Generic union type
export type RoomEventPayload = RoomEventPayloadMap[keyof RoomEventPayloadMap];

// 1. Define the Handler Function Type
export type EventHandlerFunction<T extends keyof RoomEventPayloadMap> =
    (payload: RoomEventPayloadMap[T]) => Promise<void>;

// 2. Map of exact handler signatures
export type RoomEventHandlerMap = {
    [K in keyof RoomEventPayloadMap]: EventHandlerFunction<K>[];
};