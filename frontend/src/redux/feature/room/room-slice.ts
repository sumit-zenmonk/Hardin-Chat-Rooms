"use client";

import { createSlice } from "@reduxjs/toolkit";
import { createRoom, getJoinedRooms, getMyRooms, getPublicRooms } from "./room-action";
import { RoomState } from "./room-type";

const initialState: RoomState = {
    myrooms: [],
    myRoomsTotalDocuments: 0,
    publicRooms: [],
    publicRoomsTotalDocuments: 0,
    joinedRooms: [],
    joinedRoomsTotalDocuments: 0,
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

                if (action.payload.offset === 0) {
                    state.myrooms = action.payload.data;
                } else {
                    const mergedRooms = [
                        ...state.myrooms,
                        ...action.payload.data,
                    ];
                    state.myrooms = Array.from(new Map(mergedRooms.map((room) => [room.uuid, room])).values());
                }

                state.myRoomsTotalDocuments = action.payload.totalDocuments;
                state.error = null;
            })
            .addCase(getMyRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getPublicRooms.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPublicRooms.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.offset === 0) {
                    state.publicRooms = action.payload.data;
                } else {
                    const mergedRooms = [
                        ...state.publicRooms,
                        ...action.payload.data,
                    ];
                    state.publicRooms = Array.from(new Map(mergedRooms.map((room) => [room.uuid, room])).values());
                }

                state.publicRoomsTotalDocuments = action.payload.totalDocuments;
                state.error = null;
            })
            .addCase(getPublicRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getJoinedRooms.pending, (state) => {
                state.loading = true;
            })
            .addCase(getJoinedRooms.fulfilled, (state, action) => {
                state.loading = false;
                // if (action.meta.arg.offset == 0) {
                state.joinedRooms = action.payload.data;
                // }
                state.joinedRoomsTotalDocuments = action.payload.totalDocuments;
                state.error = null;
            })
            .addCase(getJoinedRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { resetRoomError } = roomSlice.actions;
export default roomSlice.reducer;