import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class FighterDto {
  @IsBoolean()
  @IsNotEmpty()
  opponent: boolean;

  @IsNotEmpty()
  @IsBoolean()
  me: boolean;

  @IsNumber()
  @IsNotEmpty()
  brawlerId: number;
}
