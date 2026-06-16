export interface Room {
    uuid: string;
    customer_uuid: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface CreateRoomPayload {
    name: string,
    description?: string
}

export interface RoomState {
    myroom: Room | [];
    loading: boolean;
    error: string | null;
}