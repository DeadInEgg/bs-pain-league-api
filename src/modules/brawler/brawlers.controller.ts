import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BrawlersService } from './brawlers.service';
import { Brawler } from './entities/brawler.entity';

@ApiBearerAuth()
@ApiTags('Brawlers')
@Controller('brawlers')
export class BrawlersController {
  constructor(private readonly brawlerService: BrawlersService) {}

  @ApiOperation({ summary: 'Get a list of available brawlers' })
  @Get()
  async getBrawlers(): Promise<Brawler[]> {
    return this.brawlerService.findBrawlers();
  }
}
