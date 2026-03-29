import {
  IsInt,
  IsOptional,
  IsString,
  IsPositive,
  MaxLength,
} from "class-validator";

export class UpdateKursDto {
  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsInt()
  price_old?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  price_new?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  author_id?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  daraja_id?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  category_id?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  language_id?: number;
}
