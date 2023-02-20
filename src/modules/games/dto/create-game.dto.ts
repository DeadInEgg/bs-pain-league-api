import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { GameResult } from '../entities/game.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FighterDto } from './fighter.dto';

export class CreateGameDto {
  @IsEnum(GameResult, {
    message: 'Result must be : victory, draw or defeat',
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ['victory', 'draw', 'defeat'] })
  result: GameResult;

  @IsNotEmpty()
  mapId: number;

  @IsNotEmpty()
  trackerHash: string;

  @ValidateNested()
  @Type(() => FighterDto)
  fighters: FighterDto[];
}
