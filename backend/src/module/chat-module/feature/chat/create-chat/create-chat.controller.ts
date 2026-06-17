import { Body, Controller, Post, Req } from "@nestjs/common";
import { CreateChatService } from "./create-chat.handler";
import { CreateChatDto } from "./create-chat.dto";
import type { Request } from "express";

@Controller()
export class CreateChatController {
    constructor(private readonly createChatService: CreateChatService) { }

    @Post()
    async createChat(@Req() req: Request, @Body() body: CreateChatDto) {
        await this.createChatService.handle(req, body);

        return {
            message: "Chat Created Successfully"
        };
    }
}