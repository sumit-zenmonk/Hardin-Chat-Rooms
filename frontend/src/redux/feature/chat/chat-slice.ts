"use client";

import { createSlice } from "@reduxjs/toolkit";
import { RoomChatState } from "./chat-type";
import { createRoomChat } from "./chat-action";

const initialState: RoomChatState = {
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
            .addCase(createRoomChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRoomChat.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createRoomChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { resetRoomError } = roomSlice.actions;
export default roomSlice.reducer;