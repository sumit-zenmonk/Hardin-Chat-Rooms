"use client";

import { createSlice } from "@reduxjs/toolkit";
import { RoomMemberState } from "./member-type";

const initialState: RoomMemberState = {
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
    },
});

export const { resetRoomError } = roomSlice.actions;
export default roomSlice.reducer;