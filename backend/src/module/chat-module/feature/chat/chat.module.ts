import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateChatModule } from "./create-chat/create-chat.module";
import { GetRoomChatListingModule } from "./get-room-chat-listing/get-room-chat-listing.module";

@Module({
    imports: [
        CreateChatModule,
        GetRoomChatListingModule,
        RouterModule.register([
            {
                path: 'room/chat',
                children: [
                    { path: '', module: CreateChatModule },
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