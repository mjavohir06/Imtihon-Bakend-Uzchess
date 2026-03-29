import {
    IsString,
    IsInt,
    IsOptional,
    Min,
    MaxLength,
    IsNotEmpty,
    MinLength,

} from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(32)
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    @IsNotEmpty()
    login?: string;

    @IsOptional()
    @IsString()
    @MaxLength(32)
    @MinLength(5)
    @IsNotEmpty()
    parol?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    role?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    login_type?: string;

}
