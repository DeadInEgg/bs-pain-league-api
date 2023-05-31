import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapsService } from './maps.service';
import { Map } from './entities/map.entity';
import { GetMapsDto } from './dto/get-maps.dto';

@ApiBearerAuth()
@ApiTags('Maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @ApiOperation({ summary: 'Get a list of available maps' })
  @Get()
  getMaps(
    @Query() { isActive, isOnPowerLeagueSeason, mode }: GetMapsDto,
  ): Promise<Map[]> {
    return this.mapsService.findMaps(isActive, isOnPowerLeagueSeason, mode);
  }
}
