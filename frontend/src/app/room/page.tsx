"use client";

import { Button, Container } from "@mui/material";
import styles from "./room.module.css";
import { useState } from "react";
import CreateRoomModal from "@/component/create-room-modal/create-room-modal";

export default function Room() {
    const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);

    const handleAddAddressClose = () => {
        setOpenCreateRoomModal(false);
        setTimeout(() => {
            // fetchAddresses();
        }, 500);
    };

    return (
        <Container>
            <Button onClick={() => setOpenCreateRoomModal(true)}>
                Add address
            </Button>

            <CreateRoomModal isOpen={openCreateRoomModal} onClose={handleAddAddressClose} />
        </Container>
    );
}