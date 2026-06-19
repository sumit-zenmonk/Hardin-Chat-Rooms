import { Module } from "@nestjs/common";
import { RegisterUserModule } from "./register-user/register-user.module";
import { RouterModule } from "@nestjs/core";
import { LoginUserModule } from "./login-user/login-user.module";
import { GetUserModule } from "./get-user/get-user.module";

@Module({
    imports: [
        RegisterUserModule,
        LoginUserModule,
        GetUserModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: RegisterUserModule },
                    { path: '/', module: LoginUserModule },
                    { path: '/', module: GetUserModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [UserModule],
})

export class UserModule { }