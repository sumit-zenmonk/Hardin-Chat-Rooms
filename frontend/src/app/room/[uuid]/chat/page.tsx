"use client";

import { Box, CircularProgress, Container, Typography } from "@mui/material";
import styles from "./room.module.css";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { getRoomMembers } from "@/redux/feature/member/member-action";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";

export default function SpecificRoom() {
  const dispatch = useAppDispatch();
  const { uuid } = useParams();
  const room_uuid = String(uuid);
  const { roomMembers } = useAppSelector((state: RootState) => state.roomMemberReducer);
  const members = roomMembers?.[room_uuid];
  const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;

  useEffect(() => {
    dispatch(getRoomMembers({ room_uuid: room_uuid, limit: 0, offset: 0 })).unwrap();
  }, []);

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.heading}>
          {members?.[0] ? members[0].room.name : "Specific Room Title"} Chat's
        </Typography>

        <Typography className={styles.subHeading}>
          {members?.[0] ? members[0].room.description : "Specific Room Description"}
        </Typography>
      </Box>

      <Box id="scrollableDiv" className={styles.scrollWrapper}>
        <InfiniteScroll
          dataLength={0}
          next={() => { }}
          hasMore={false}
          loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
          endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
          scrollableTarget="scrollableDiv"
        >
          <Box className={styles.roomChatWrapper}>

          </Box>
        </InfiniteScroll>
      </Box>
    </Container>
  );
}