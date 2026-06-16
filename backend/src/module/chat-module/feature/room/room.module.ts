import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateRoomModule } from "./create-room/create-room.module";
import { GetRoomListingModule } from "./get-room-listing/get-room-listing.module";
import { DeleteRoomModule } from "./delete-room/delete-room-listing.module";
import { GetPublicRoomListingModule } from "./get-public-room-listing/get-public-room-listing.module";

@Module({
    imports: [
        CreateRoomModule,
        GetRoomListingModule,
        DeleteRoomModule,
        GetPublicRoomListingModule,
        RouterModule.register([
            {
                path: 'room',
                children: [
                    { path: '', module: CreateRoomModule },
                    { path: '', module: GetRoomListingModule },
                    { path: '', module: DeleteRoomModule },
                    { path: 'public', module: GetPublicRoomListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class RoomModule { }