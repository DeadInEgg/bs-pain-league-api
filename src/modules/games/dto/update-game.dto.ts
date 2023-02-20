import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { GameResult } from '../entities/game.entity';
import { Type } from 'class-transformer';
import { FighterDto } from './fighter.dto';

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

  @ValidateNested()
  @Type(() => FighterDto)
  fighters: FighterDto[] = [];
}
