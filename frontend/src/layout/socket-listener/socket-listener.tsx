"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { connectSocket, disconnectSocket, getSocket } from "@/service/socket";
import { SocketEventNameEnum } from "@/layout/socket-listener/socket-event.enum";
import { addJoinedRoom, addMyRoom, removeJoinedRoom, removeMyRoom } from "@/redux/feature/room/room-slice";

import { addChat, removeChat } from "@/redux/feature/chat/chat-slice";
import { updateMemberOnlineStatus } from "@/redux/feature/member/member-slice";

export const LayoutSocketListener = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.authReducer);

    useEffect(() => {
        if (token) {
            const socket = connectSocket(token);

            socket.on(SocketEventNameEnum.ROOM_CREATED, (data) => {
                console.log(SocketEventNameEnum.ROOM_CREATED, data);
                dispatch(addMyRoom(data));
            });

            socket.on(SocketEventNameEnum.ROOM_DELETED, (data) => {
                console.log(SocketEventNameEnum.ROOM_DELETED, data);
                dispatch(removeMyRoom(data.uuid));
            });

            socket.on(SocketEventNameEnum.ROOM_MEMBER_CREATED, (data) => {
                console.log(SocketEventNameEnum.ROOM_MEMBER_CREATED, data);
                dispatch(addJoinedRoom(data));
            });

            socket.on(SocketEventNameEnum.ROOM_MEMBER_DELETED, (data) => {
                console.log(SocketEventNameEnum.ROOM_MEMBER_DELETED, data);
                dispatch(removeJoinedRoom(data.room_uuid));
            });

            socket.on(SocketEventNameEnum.ROOM_CHAT_CREATED, (data) => {
                console.log(SocketEventNameEnum.ROOM_CHAT_CREATED, data);
                dispatch(addChat(data));
            });

            socket.on(SocketEventNameEnum.ROOM_CHAT_DELETED, (data) => {
                console.log(SocketEventNameEnum.ROOM_CHAT_DELETED, data);
                dispatch(removeChat(data));
            });

            socket.on(SocketEventNameEnum.ROOM_MEMBER_ONLINE_STATUS, (data) => {
                console.log(SocketEventNameEnum.ROOM_MEMBER_ONLINE_STATUS, data);
                dispatch(updateMemberOnlineStatus(data));
            });

            return () => {
                socket.off(SocketEventNameEnum.ROOM_CREATED);
                socket.off(SocketEventNameEnum.ROOM_DELETED);
                socket.off(SocketEventNameEnum.ROOM_MEMBER_CREATED);
                socket.off(SocketEventNameEnum.ROOM_MEMBER_DELETED);
                socket.off(SocketEventNameEnum.ROOM_CHAT_CREATED);
                socket.off(SocketEventNameEnum.ROOM_CHAT_DELETED);
                socket.off(SocketEventNameEnum.ROOM_MEMBER_ONLINE_STATUS);
                disconnectSocket();
            };
        }
    }, [dispatch, token]);

    return null;
};