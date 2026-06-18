"use client";

import { createSlice } from "@reduxjs/toolkit";
import { RoomMemberState } from "./member-type";
import { createRoomMember, deleteRoomMember, getRoomMembers } from "./member-action";

const initialState: RoomMemberState = {
    roomMembers: {},
    roomMembersTotalDocuments: {},
    loading: false,
    error: null,
};

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        resetRoomError: (state) => {
            state.error = null;
        },
        updateMemberOnlineStatus: (state, action) => {
            const { room_uuid, user_uuid, is_online } = action.payload;
            if (state.roomMembers[room_uuid]) {
                const memberIndex = state.roomMembers[room_uuid].findIndex(m => m.user_uuid === user_uuid);
                if (memberIndex !== -1) {
                    state.roomMembers[room_uuid][memberIndex].is_online = is_online;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRoomMember.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRoomMember.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createRoomMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteRoomMember.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteRoomMember.fulfilled, (state, action) => {
                state.roomMembers[action.payload.room_uuid] = state.roomMembers[action.payload.room_uuid].filter((member) => member.user_uuid !== action.payload.user_uuid);
            })
            .addCase(deleteRoomMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getRoomMembers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRoomMembers.fulfilled, (state, action) => {
                const { data, totalDocuments, room_uuid } = action.payload;
                state.loading = false;
                if (!state.roomMembers) {
                    state.roomMembers = {};
                }
                if (!state.roomMembersTotalDocuments) {
                    state.roomMembersTotalDocuments = {};
                }
                state.roomMembers[room_uuid] = data;
                state.roomMembersTotalDocuments[room_uuid] = totalDocuments;
            })
            .addCase(getRoomMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { resetRoomError, updateMemberOnlineStatus } = roomSlice.actions;
export default roomSlice.reducer;