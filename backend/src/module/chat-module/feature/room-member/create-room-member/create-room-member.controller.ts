import { Body, Controller, Post, Req } from "@nestjs/common";
import { CreateRoomMemberService } from "./create-room-member.handler";
import { CreateRoomMemberDto } from "./create-room-member.dto";
import type { Request } from "express";

@Controller()
export class CreateRoomMemberController {
    constructor(private readonly createRoomMemberService: CreateRoomMemberService) { }

    @Post()
    async createRoomMember(@Req() req: Request, @Body() body: CreateRoomMemberDto) {
        await this.createRoomMemberService.handle(req, body);

        return {
            message: "Room Created Successfully"
        };
    }
}