import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ModesService } from './modes.services';
import { Mode } from './entities/mode.entity';
import { GetModesDto } from './dto/get-modes.dto';

@ApiBearerAuth()
@ApiTags('Modes')
@Controller('modes')
export class ModesController {
  constructor(private readonly modesService: ModesService) {}

  @ApiOperation({ summary: 'Get a list of available modes' })
  @Get()
  getModes(@Query() { isActive, type }: GetModesDto): Promise<Mode[]> {
    return this.modesService.findModes(isActive, type);
  }
}
