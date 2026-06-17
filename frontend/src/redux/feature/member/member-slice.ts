"use client";

import { createSlice } from "@reduxjs/toolkit";
import { RoomMemberState } from "./member-type";
import { getRoomMembers } from "./member-action";

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
            state = initialState
        },
    },
    extraReducers: (builder) => {
        builder
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

export const { resetRoomError } = roomSlice.actions;
export default roomSlice.reducer;