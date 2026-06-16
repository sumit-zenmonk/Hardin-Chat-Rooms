import { Body, Controller, Delete, Param, Req } from "@nestjs/common";
import { DeleteRoomMemberService } from "./delete-room-listing.handler";
import type { Request } from "express";

@Controller()
export class DeleteRoomMemberController {
    constructor(private readonly deleteRoomMemberService: DeleteRoomMemberService) { }

    @Delete('/:uuid')
    async deleteRoomMember(@Req() req: Request, @Param('uuid') uuid: string) {
        await this.deleteRoomMemberService.handle(req, uuid);

        return {
            message: "Room Member Deleted Success"
        }
    }
}