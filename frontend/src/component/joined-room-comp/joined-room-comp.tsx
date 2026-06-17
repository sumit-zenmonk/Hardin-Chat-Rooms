"use client";

import { Avatar, Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import styles from "./room.module.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { getJoinedRooms, getPublicRooms } from "@/redux/feature/room/room-action";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import type { Room } from "@/redux/feature/room/room-type";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteRoomMember } from "@/redux/feature/member/member-action";
import { useRouter } from "next/navigation";

export default function JoinedRoomComp() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { joinedRooms, joinedRoomsTotalDocuments } = useAppSelector((state: RootState) => state.roomReducer);
    const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
    const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;

    useEffect(() => {
        if (!joinedRooms.length) {
            dispatch(getJoinedRooms({ limit, offset: 0, })).unwrap();
        }
    }, []);

    const fetchRooms = async () => {
        try {
            if (joinedRooms.length >= joinedRoomsTotalDocuments) return;

            const newOffset = offset + limit;
            setOffset(newOffset);
            await dispatch(getJoinedRooms({ limit, offset: newOffset, })).unwrap();
        } catch (error: any) {
            enqueueSnackbar(error, { variant: "error" });
            console.log(error);
        }
    };

    const handleRemoveMember = async (room_uuid: string) => {
        try {
            await dispatch(deleteRoomMember({ room_uuid })).unwrap();
        } catch (error: any) {
            enqueueSnackbar(error, { variant: "error" });
            console.log(error);
        }
    };

    return (
        <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.heading}>
                    Joined Rooms Listing
                </Typography>

                <Typography className={styles.subHeading}>
                    Infinite Scroll Rooms
                </Typography>
            </Box>

            <Box id="scrollableDiv" className={styles.scrollWrapper}>
                <InfiniteScroll
                    dataLength={joinedRooms?.length || 0}
                    next={fetchRooms}
                    hasMore={joinedRooms?.length < joinedRoomsTotalDocuments}
                    loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
                    endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
                    scrollableTarget="scrollableDiv"
                >
                    <Box className={styles.roomWrapper}>
                        {joinedRooms && joinedRooms.map((room: Room) => {
                            return (
                                <Card
                                    key={room.uuid}
                                    className={styles.card}
                                    elevation={2}
                                >
                                    <CardContent className={styles.cardContent}>
                                        <Typography className={styles.roomName}>{room.name}</Typography>
                                        <Typography className={styles.description}>{room.description}</Typography>
                                    </CardContent>

                                    <Button
                                        onClick={() => router.push(`/room/${room.uuid}`)}
                                    >
                                        View Room
                                    </Button>

                                    <Button
                                        className={styles.deleteRoom}
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleRemoveMember(room.uuid)}
                                    >
                                        Exit Room
                                    </Button>
                                </Card>
                            );
                        })}
                    </Box>
                </InfiniteScroll>
            </Box>

        </Container>
    );
}