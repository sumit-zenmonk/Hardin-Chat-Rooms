"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { RoomChatCreatePayload } from "./chat-type";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const LIMIT = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
const OFFSET = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0;

export const createRoomChat = createAsyncThunk<
    { message: string },
    RoomChatCreatePayload,
    { state: RootState }
>(
    "room/chat/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${BACKEND_URL}/api/v1/room/chat`, {
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