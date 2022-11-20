import { IsEnum, IsNotEmpty } from 'class-validator';
import { GameResult } from '../entities/game.entity';
import { ApiProperty } from '@nestjs/swagger';

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
  modeId: number;

  @IsNotEmpty()
  trackerHash: string;
}
