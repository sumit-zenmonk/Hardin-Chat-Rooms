export interface CreateRoomMemberPayload {
    room_uuid: string
}

export interface RoomMemberState {
    loading: boolean;
    error: string | null;
}