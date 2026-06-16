import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateRoomModule } from "./create-room/create-room.module";
import { GetRoomListingModule } from "./get-room-listing/get-room-listing.module";
import { DeleteRoomModule } from "./delete-room/delete-room-listing.module";

@Module({
    imports: [
        CreateRoomModule,
        GetRoomListingModule,
        DeleteRoomModule,
        RouterModule.register([
            {
                path: 'room',
                children: [
                    { path: '', module: CreateRoomModule },
                    { path: '', module: GetRoomListingModule },
                    { path: '', module: DeleteRoomModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class RoomModule { }