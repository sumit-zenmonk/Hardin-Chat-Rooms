import { Global, Module } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { UserRepository } from "src/module/auth-module/infrastructure/repository/user.repository";
import { JwtHelperService } from "src/module/auth-module/infrastructure/services/jwt.service";

@Global()
@Module({
    providers: [SocketService, JwtHelperService, UserRepository],
    exports: [SocketService],
})
export class SocketModule { }
