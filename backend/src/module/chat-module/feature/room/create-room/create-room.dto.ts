import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, Min, Max } from 'class-validator';

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    @Min(3)
    @Max(40)
    name: string;

    @IsString()
    @Min(10)
    @Max(100)
    @IsOptional()
    description: string;
}