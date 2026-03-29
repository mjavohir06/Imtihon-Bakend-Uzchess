import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  MaxLength,
  IsNotEmpty,
  MinLength,

} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MaxLength(32)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  login: string;

  @IsString()
  @MaxLength(32)
  @MinLength(5)
  @IsNotEmpty()
  parol: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  role?: string;  

  
  @IsString()
  @IsNotEmpty()
  login_type: string;

}
