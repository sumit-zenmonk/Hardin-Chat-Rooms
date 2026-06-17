"use client";

import { useState } from "react";
import styles from "./dashboard.module.css";
import { Box, Button, Typography } from "@mui/material";
import JoinedRoomComp from "@/component/joined-room-comp/joined-room-comp";
import MyRoomComp from "@/component/my-room-comp/my-room-comp";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard/room");

  const renderContent = () => {
    switch (activeTab) {
      case "room":
        return <JoinedRoomComp />;
      default:
        return <MyRoomComp />;
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.sidebar}>
        <Box
          className={`${styles.menuItem} ${activeTab === "dashboard/room" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("dashboard/room")}
        >
          <Typography>My Rooms</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activeTab === "room" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("room")}
        >
          <Typography>Joined Rooms</Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className={styles.main}>
        {renderContent()}
      </Box>
    </Box>
  );
}