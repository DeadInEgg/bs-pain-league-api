import { IsNotEmpty } from 'class-validator';
import { GameResult } from '../entities/game.entity';

export class CreateGameDto {
  @IsNotEmpty()
  result: GameResult;

  @IsNotEmpty()
  mapId: number;

  @IsNotEmpty()
  modeId: number;

  @IsNotEmpty()
  trackerId: number;
}
