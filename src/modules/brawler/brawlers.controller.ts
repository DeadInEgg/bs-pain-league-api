import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BrawlersService } from './brawlers.service';

@ApiBearerAuth()
@ApiTags('Brawlers')
@Controller('brawlers')
export class BrawlersController {
  constructor(private readonly brawlerService: BrawlersService) {}

  @ApiOperation({ summary: 'Get a list of available brawlers' })
  @Get()
  async getBrawlers() {
    return await this.brawlerService.findBrawlers();
  }
}
