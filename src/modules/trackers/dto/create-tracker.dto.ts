import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateTrackerDto {
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  /**
   * Player's id in brawl star app
   */
  @IsOptional()
  tag?: string;
}
