import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";

@Entity('room_member')
export class RoomMemberEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid", nullable: false })
    room_uuid: string;

    @Column({ type: "uuid", nullable: false })
    user_uuid: string;

    @Column({ type: "bool", default: false })
    is_online: boolean;

    @ManyToOne(() => RoomEntity, (room) => room.members, { eager: true })
    @JoinColumn({ name: "room_uuid" })
    room: RoomEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}