import { Module } from "@nestjs/common";
import { GetUserController } from "./get-user.controller";
import { GetUserService } from "./get-user.handler";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";

@Module({
    imports: [],
    controllers: [GetUserController],
    providers: [UserRepository, GetUserService],
    exports: [],
})
export class GetUserModule { }
