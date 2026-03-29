import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  MaxLength,
} from "class-validator";

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price_old?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  price_new?: number;

  @IsOptional()
  @IsInt()
  author_id?: number;

  @IsOptional()
  @IsInt()
  daraja_id?: number;

  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsInt()
  language_id?: number;
}
