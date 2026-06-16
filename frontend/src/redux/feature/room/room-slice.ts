"use client";

import { createSlice } from "@reduxjs/toolkit";
import { createRoom, getMyRooms } from "./room-action";
import { RoomState } from "./room-type";

const initialState: RoomState = {
    myrooms: [],
    myRoomsTotalDocuments: 0,
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
            .addCase(createRoom.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getMyRooms.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.myrooms = action.payload.data;
                state.myRoomsTotalDocuments = action.payload.totalDocuments;
                state.error = null;
            })
            .addCase(getMyRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { resetRoomError } = roomSlice.actions;
export default roomSlice.reducer;