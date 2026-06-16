import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateRoomMemberModule } from "./create-room-member/create-room-member.module";
import { DeleteRoomMemberModule } from "./delete-room-member/delete-room-listing.module";

@Module({
    imports: [
        CreateRoomMemberModule,
        DeleteRoomMemberModule,
        RouterModule.register([
            {
                path: 'room/member',
                children: [
                    { path: '', module: CreateRoomMemberModule },
                    { path: '', module: DeleteRoomMemberModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class RoomMemberModule { }