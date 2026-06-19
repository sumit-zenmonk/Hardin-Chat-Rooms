import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetUserModule } from "./get-user/get-user.module";

@Module({
    imports: [
        GetUserModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: GetUserModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})

export class RoomUserModule { }