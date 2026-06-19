import { Injectable, NotFoundException } from "@nestjs/common";
import type { Request } from "express";
import { UserRepository } from "src/module/room-module/infrastructure/repository/user.repository";

@Injectable()
export class GetUserService {
    constructor(private readonly userRepository: UserRepository) { }

    async handle(req: Request) {
        const userArray = await this.userRepository.findByUuid(req.user.uuid);
        if (!userArray || userArray.length === 0) {
            throw new NotFoundException("User not found");
        }
        return userArray[0];
    }
}
