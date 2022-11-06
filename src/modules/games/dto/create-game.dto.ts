import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  win: boolean;

  @IsNotEmpty()
  mapId: number;

  @IsNotEmpty()
  modeId: number;

  @IsNotEmpty()
  trackerId: number;
}
