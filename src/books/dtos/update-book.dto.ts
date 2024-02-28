import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class UpdateBookDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(1000)
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  authorId: string;
}
