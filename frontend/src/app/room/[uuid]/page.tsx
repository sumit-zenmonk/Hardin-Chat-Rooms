"use client";

import { Avatar, Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import styles from "./room.module.css";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { getRoomMembers } from "@/redux/feature/member/member-action";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import { RoomMember } from "@/redux/feature/member/member-type";
import { enqueueSnackbar } from "notistack";

export default function SpecificRoom() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { uuid } = useParams();
  const room_uuid = String(uuid);
  const { roomMembers, roomMembersTotalDocuments } = useAppSelector((state: RootState) => state.roomMemberReducer);
  const members = roomMembers?.[room_uuid];
  const total_members = roomMembersTotalDocuments?.[room_uuid];
  const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;

  useEffect(() => {
    dispatch(getRoomMembers({ room_uuid: room_uuid, limit: 0, offset: 0 })).unwrap();
  }, []);

  const fetchRooms = async () => {
    try {
      if (members?.length >= total_members) return;

      const newOffset = offset + limit;
      setOffset(newOffset);
      await dispatch(getRoomMembers({ room_uuid: room_uuid, limit, offset: newOffset, })).unwrap();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.heading}>
          {members?.[0] ? members[0].room.name : "Specific Room Title"}
        </Typography>

        <Typography className={styles.subHeading}>
          {members?.[0] ? members[0].room.description : "Specific Room Description"}
        </Typography>
      </Box>

      <Box className={styles.sideButtonCard}>
        <Button
          className={styles.deleteRoom}
          onClick={() => router.push(`/room/${room_uuid}/chat`)}
        >
          View Chat
        </Button>
      </Box>

      <Box id="scrollableDiv" className={styles.scrollWrapper}>
        <InfiniteScroll
          dataLength={members?.length || 0}
          next={fetchRooms}
          hasMore={members?.length < total_members}
          loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
          endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
          scrollableTarget="scrollableDiv"
        >
          <Box className={styles.roomMemberWrapper}>
            {members && members.map((member: RoomMember) => {
              return (
                <Card
                  key={member.uuid}
                  className={styles.card}
                  elevation={2}
                >
                  <Avatar>
                    {member.user.name ? member.user.name.charAt(0).toUpperCase() : '?'}
                  </Avatar>

                  <CardContent className={styles.cardContent}>
                    <Typography className={styles.roomMemberName}>Name : {member.user.name}</Typography>
                    <Typography className={styles.email}>Email : {member.user.email}</Typography>
                    <Typography className={styles.role}>Role : {member.role}</Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </InfiniteScroll>
      </Box>
    </Container>
  );
}