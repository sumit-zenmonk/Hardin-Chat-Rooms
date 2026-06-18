"use client";

import { Box, Button, CircularProgress, Container, Typography, TextField, IconButton } from "@mui/material";
import styles from "./room.module.css";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { getRoomMembers } from "@/redux/feature/member/member-action";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { enqueueSnackbar } from "notistack";
import dynamic from 'next/dynamic';
import { createRoomChat, deleteRoomChat, getRoomChats } from "@/redux/feature/chat/chat-action";
import DeleteIcon from '@mui/icons-material/Delete';

// Dynamically import the EmojiPicker to disable SSR
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function SpecificRoomChat() {
  const dispatch = useAppDispatch();
  const { uuid } = useParams();
  const room_uuid = String(uuid);
  const { roomMembers } = useAppSelector((state: RootState) => state.roomMemberReducer);
  const { user } = useAppSelector((state: RootState) => state.authReducer);
  const { roomChats, roomChatsTotalDocuments, loading } = useAppSelector((state: RootState) => state.chatReducer);
  
  const members = roomMembers?.[room_uuid];
  const chats = roomChats?.[room_uuid] || [];
  const totalChats = roomChatsTotalDocuments?.[room_uuid] || 0;
  
  const member = roomMembers?.[room_uuid]?.find((member) => member.user_uuid == user?.uuid);
  const [offset, setOffset] = useState(0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  useEffect(() => {
    dispatch(getRoomMembers({ room_uuid: room_uuid, limit: 0, offset: 0 })).unwrap();
    dispatch(getRoomChats({ room_uuid: room_uuid, limit: limit, offset: 0 })).unwrap();
  }, [room_uuid]);

  const fetchMoreData = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    dispatch(getRoomChats({ room_uuid: room_uuid, limit: limit, offset: nextOffset }));
  };

  const togglePicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };
  const onEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleSend = async () => {
    try {
      if (!message.trim()) {
        return;
      }
      if (!member?.uuid) {
        enqueueSnackbar("Not a member right now", { variant: "info" });
        return;
      }

      await dispatch(createRoomChat({ member_uuid: member?.uuid, msg: message, room_uuid })).unwrap();

      setIsEmojiPickerOpen(false);
      setMessage('');
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
  };

  const handleDeleteChat = async (chat_uuid: string) => {
    try {
      await dispatch(deleteRoomChat({ chat_uuid })).unwrap();
      enqueueSnackbar("Message deleted", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.heading}>
          {members?.[0]?.room?.name || "Specific Room Title"} Chat's
        </Typography>

        <Typography className={styles.subHeading}>
          {members?.[0]?.room?.description || "Specific Room Description"}
        </Typography>
      </Box>

      <Box id="scrollableDiv" className={styles.scrollWrapper}>
        <InfiniteScroll
          dataLength={chats.length}
          next={fetchMoreData}
          hasMore={chats.length < totalChats}
          loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
          inverse={true}
          endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
          scrollableTarget="scrollableDiv"
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
        >
          <Box className={styles.roomChatWrapper}>
            {chats.map((chat) => (
              <Box 
                key={chat.uuid} 
                className={`${styles.chatMessage} ${chat.member?.user_uuid === user?.uuid ? styles.myMessage : styles.otherMessage}`}
              >
                <Box className={styles.messageContent}>
                  <Typography variant="caption" className={styles.senderName}>
                    {chat.member?.user_uuid === user?.uuid ? 'You' : `User ${chat.member?.user_uuid.slice(0, 4)}`}
                  </Typography>
                  <Typography className={styles.messageText}>{chat.msg}</Typography>
                  <Box className={styles.messageFooter}>
                    <Typography variant="caption" className={styles.messageTime}>
                      {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    {chat.member?.user_uuid === user?.uuid && (
                      <IconButton size="small" onClick={() => handleDeleteChat(chat.uuid)} className={styles.deleteBtn}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </InfiniteScroll>
      </Box>

      <Box className={styles.emojiPickerBox}>
        {isEmojiPickerOpen && (
          <EmojiPicker onEmojiClick={onEmojiClick} />
        )}
      </Box>

      {
        member?.user_uuid
        &&
        <Box className={styles.chatContainer}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              className={`${styles.actionButton} ${styles.sendButton}`}
              size="small"
              onClick={togglePicker}
            >
              <EmojiEmotionsIcon />
            </IconButton>
          </Box>

          <Box className={styles.inputWrapper}>
            <TextField
              className={styles.inputField}
              placeholder="Type a message"
              variant="standard"
              multiline
              minRows={1}
              maxRows={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </Box>

          <IconButton
            className={`${styles.actionButton} ${(message.trim() && message.length <= 2000) ? styles.sendButton : ''}`}
            onClick={handleSend}
            disabled={!message.trim() || message.length > 2000}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      }
    </Container>
  );
}