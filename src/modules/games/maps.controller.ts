import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapsService } from './maps.service';
import { Map } from './entities/map.entity';

@ApiBearerAuth()
@ApiTags('Maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @ApiOperation({ summary: 'Get a list of available maps' })
  @Get()
  async getMaps(): Promise<Map[]> {
    return this.mapsService.findMaps();
  }
}
