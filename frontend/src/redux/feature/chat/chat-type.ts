export interface RoomChatCreatePayload {
    member_uuid: string;
    room_uuid: string;
    parent_uuid?: string;
    msg: string;
}

export interface RoomChatState {
    loading: boolean;
    error: string | null;
}