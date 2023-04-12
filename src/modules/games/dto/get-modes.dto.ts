import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { transformQueryParamsToBoolOrUndefined } from '../../../utils/transform.utils';

export class GetModesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => transformQueryParamsToBoolOrUndefined(value))
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;
}
