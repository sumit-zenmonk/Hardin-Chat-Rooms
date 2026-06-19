import { Controller, Get, Req } from "@nestjs/common";
import { GetUserService } from "./get-user.handler";
import type { Request } from "express";

@Controller('/')
export class GetUserController {
    constructor(private readonly getUserService: GetUserService) { }

    @Get()
    async getUser(@Req() req: Request) {
        const user = await this.getUserService.handle(req);
        return {
            message: "User Profile Fetched",
            user,
        };
    }
}
