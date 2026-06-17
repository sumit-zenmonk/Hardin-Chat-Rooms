"use client";

import { Box, Container, Typography } from "@mui/material";
import styles from "./room.module.css";

export default function SpecificRoom() {
  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.heading}>
          specific Room
        </Typography>

      </Box>
    </Container>
  );
}