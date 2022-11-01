import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateTrackerDto {
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsOptional()
  tag: string;
}
