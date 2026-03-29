import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  MaxLength,
} from "class-validator";

export class CreateBookDto {
  @IsString()
  img: string;

  @IsString()
  @MaxLength(50)
  title: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price_old?: number;

  @IsInt()
  @Min(0)
  price_new: number;

  @IsInt()
  author_id: number;

  @IsInt()
  daraja_id: number;

  @IsInt()
  category_id: number;

  @IsInt()
  language_id: number;
}
