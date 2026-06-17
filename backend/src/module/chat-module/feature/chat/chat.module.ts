import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateRoomChatModule } from "./create-room-chat/create-room-chat.module";
import { GetRoomChatListingModule } from "./get-room-chat-listing/get-room-chat-listing.module";

@Module({
    imports: [
        CreateRoomChatModule,
        GetRoomChatListingModule,
        RouterModule.register([
            {
                path: 'room/chat',
                children: [
                    { path: '', module: CreateRoomChatModule },
                    { path: '', module: GetRoomChatListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class ChatModule { }