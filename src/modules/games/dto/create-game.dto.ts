import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  result: string;

  @IsNotEmpty()
  mapId: number;

  @IsNotEmpty()
  modeId: number;

  @IsNotEmpty()
  trackerId: number;
}
