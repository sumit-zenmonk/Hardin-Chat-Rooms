"use client";

import { Avatar, Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import styles from "./home.module.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { getPublicRooms } from "@/redux/feature/room/room-action";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import type { Room } from "@/redux/feature/room/room-type";
import { createRoomMember } from "@/redux/feature/member/member-action";

export default function Home() {
  const dispatch = useAppDispatch();
  const { publicRooms, publicRoomsTotalDocuments } = useAppSelector((state: RootState) => state.roomReducer);
  const { user } = useAppSelector((state: RootState) => state.authReducer);
  const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;

  useEffect(() => {
    if (!fetchRooms.length) {
       dispatch(getPublicRooms({ limit, offset: 0, })).unwrap();
    }
  }, []);

  const fetchRooms = async () => {
    try {
      if (publicRooms.length >= publicRoomsTotalDocuments) return;

      const newOffset = offset + limit;
      setOffset(newOffset);
      await dispatch(getPublicRooms({ limit, offset: newOffset, })).unwrap();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  const handleJoin = async (uuid: string) => {
    try {
      await dispatch(createRoomMember({ room_uuid: uuid })).unwrap();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.heading}>
          Public Rooms Listing
        </Typography>

        <Typography className={styles.subHeading}>
          Infinite Scroll Rooms
        </Typography>
      </Box>

      <Box id="scrollableDiv" className={styles.scrollWrapper}>
        <InfiniteScroll
          dataLength={publicRooms?.length || 0}
          next={fetchRooms}
          hasMore={publicRooms?.length < publicRoomsTotalDocuments}
          loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
          endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
          scrollableTarget="scrollableDiv"
        >
          <Box className={styles.roomWrapper}>
            {publicRooms && publicRooms.map((room: Room) => {
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

                  {
                    user &&
                    <Button
                      onClick={() => handleJoin(room.uuid)}
                    >
                      Join
                    </Button>}
                </Card>
              );
            })}
          </Box>
        </InfiniteScroll>
      </Box>

    </Container>
  );
}