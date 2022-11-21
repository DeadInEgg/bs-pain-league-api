import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { GameResult } from '../entities/game.entity';

export class UpdateGameDto {
  @IsEnum(GameResult, {
    message: 'result must be : victory, draw or defeat',
  })
  @ApiPropertyOptional()
  @ApiProperty({ enum: ['victory', 'draw', 'defeat'] })
  result: GameResult;

  @ApiPropertyOptional()
  @IsOptional()
  mapId: number;

  @ApiPropertyOptional()
  @IsOptional()
  modeId: number;
}
