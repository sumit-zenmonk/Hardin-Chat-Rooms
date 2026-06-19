"use client";

import { Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import styles from "./room.module.css";
import bannerStyles from "../../app/banner.module.css";
import { useEffect, useState } from "react";
import CreateRoomModal from "@/component/create-room-modal/create-room-modal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { deleteRoom, getMyRooms } from "@/redux/feature/room/room-action";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import type { Room } from "@/redux/feature/room/room-type";
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/navigation";
import { randomImageUrl } from "@/utils/random";

export default function MyRoomComp() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { myrooms, myRoomsTotalDocuments, viewerCounts } = useAppSelector((state: RootState) => state.roomReducer);
    const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
    const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
    const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;

    useEffect(() => {
        if (!myrooms.length) {
            dispatch(getMyRooms({ limit, offset: 0, })).unwrap();
        }
    }, []);

    const fetchRooms = async () => {
        try {
            if (myrooms.length >= myRoomsTotalDocuments) return;

            const newOffset = offset + limit;
            setOffset(newOffset);
            await dispatch(getMyRooms({ limit, offset: newOffset, })).unwrap();
        } catch (error: any) {
            enqueueSnackbar(error, { variant: "error" });
            console.log(error);
        }
    };

    const handleAddRoomClose = () => {
        setOpenCreateRoomModal(false);
    };

    const handleDelete = async (uuid: string) => {
        try {
            await dispatch(deleteRoom({ uuid })).unwrap();
        } catch (error: any) {
            enqueueSnackbar(error, { variant: "error" });
            console.log(error);
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.heading}>
                    Your Rooms Listing
                </Typography>

                <Typography className={styles.subHeading}>
                    Infinite Scroll Rooms
                </Typography>
            </Box>

            <Box className={styles.sideButtonCard}>
                <Button onClick={() => setOpenCreateRoomModal(true)}>
                    Add Room
                </Button>
            </Box>

            <Box id="scrollableDiv" className={styles.scrollWrapper}>
                <InfiniteScroll
                    dataLength={myrooms?.length || 0}
                    next={fetchRooms}
                    hasMore={myrooms.length < myRoomsTotalDocuments}
                    loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
                    endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
                    scrollableTarget="scrollableDiv"
                >
                    <Box className={styles.roomWrapper}>
                        {myrooms && myrooms.map((room: Room) => {
                            return (
                                <Card
                                    key={room.uuid}
                                    className={styles.card}
                                    elevation={2}
                                >
                                    <Box className={bannerStyles.banner} style={{ backgroundImage: randomImageUrl() }}></Box>

                                    <CardContent className={styles.cardContent}>
                                        <Typography className={styles.roomName}>{room.name}</Typography>
                                        <Typography className={styles.description}>{room.description}</Typography>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: '8px' }}>
                                            Live Viewers: {viewerCounts[room.uuid] || 0}
                                        </Typography>

                                        <Button
                                            onClick={() => router.push(`/room/${room.uuid}`)}
                                        >
                                            View Room
                                        </Button>

                                        <Button
                                            className={styles.deleteRoom}
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(room.uuid)}
                                        >
                                            Delete
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                </InfiniteScroll>
            </Box>

            <CreateRoomModal isOpen={openCreateRoomModal} onClose={handleAddRoomClose} />
        </Box>
    );
}