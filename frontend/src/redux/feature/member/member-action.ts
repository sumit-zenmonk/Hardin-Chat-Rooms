"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { CreateRoomMemberPayload } from "./member-type";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createRoomMember = createAsyncThunk<
    { message: string },
    CreateRoomMemberPayload,
    { state: RootState }
>(
    "room/member/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${BACKEND_URL}/api/v1/room/member`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteRoomMember = createAsyncThunk<
    { message: string; uuid: string },
    { uuid: string },
    { state: RootState }
>("delete/room/member", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${BACKEND_URL}/api/v1/room/member/${payload.uuid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message);
        }

        return { message: result.message, uuid: payload.uuid };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});