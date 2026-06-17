import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateChatModule } from "./create-chat/create-chat.module";

@Module({
    imports: [
        CreateChatModule,
        RouterModule.register([
            {
                path: 'room/chat',
                children: [
                    { path: '', module: CreateChatModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class ChatModule { }