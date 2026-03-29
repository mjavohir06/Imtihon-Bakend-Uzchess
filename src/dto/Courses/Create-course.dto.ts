import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPositive,
  MaxLength,
} from "class-validator";

export class CreateKursDto {
  @IsString()
  @IsNotEmpty()
  img: string;

  @IsString()
  @MaxLength(50)
  title: string;

  @IsOptional()
  @IsInt()
  price_old?: number;

  @IsInt()
  @IsPositive()
  price_new: number;

  @IsInt()
  @IsPositive()
  author_id: number;

  @IsInt()
  @IsPositive()
  daraja_id: number;

  @IsInt()
  @IsPositive()
  category_id: number;

  @IsInt()
  @IsPositive()
  language_id: number;
}
