import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, Min, Max, MaxLength } from 'class-validator';

export class CreateRoomMemberDto {
    @IsString()
    @IsNotEmpty()
    room_uuid: string;
}