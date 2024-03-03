import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class LikeBookDTO {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
