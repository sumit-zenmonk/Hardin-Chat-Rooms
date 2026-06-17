import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChatDto {
    @IsUUID()
    member_uuid: string;

    @IsUUID()
    room_uuid: string;

    @IsUUID()
    @IsOptional()
    parent_uuid: string;

    @IsString()
    msg: string
}