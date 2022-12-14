import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapsService } from './maps.service';

@ApiBearerAuth()
@ApiTags('Maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @ApiOperation({ summary: 'Get a list of available maps' })
  @Get()
  async getMaps() {
    return await this.mapsService.findMaps();
  }
}
