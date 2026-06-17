import { Body, Controller, Delete, Param, Req } from "@nestjs/common";
import { ExitRoomMemberService } from "./exit-room-listing.handler";
import type { Request } from "express";

@Controller()
export class ExitRoomMemberController {
    constructor(private readonly exitRoomMemberService: ExitRoomMemberService) { }

    @Delete('/:uuid')
    async exitRoomMember(@Req() req: Request, @Param('uuid') uuid: string) {
        await this.exitRoomMemberService.handle(req, uuid);

        return {
            message: "Room Member Deleted Success"
        }
    }
}