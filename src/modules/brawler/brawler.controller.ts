import {Controller, Get} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {BrawlerService} from "./brawler.service";

@ApiBearerAuth()
@ApiTags('Brawlers')
@Controller('brawlers')
export class BrawlerController {
  constructor(
    private readonly brawlerService: BrawlerService,
  ) {}

  @ApiOperation({ summary: 'Get a list of available brawlers' })
  @Get()
  async getBrawlers() {
    return await this.brawlerService.findBrawlers();
  }
}
