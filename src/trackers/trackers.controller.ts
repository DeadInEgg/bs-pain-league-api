import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';

@Controller('trackers')
export class TrackersController {
  constructor(private readonly trackersService: TrackersService) {}

  @Post()
  create(@Body() createTrackerDto: CreateTrackerDto) {
    return this.trackersService.create(createTrackerDto);
  }

  @Get()
  findByCurrentUser() {
    //TODO receive current user and find his trackers
  }

  @Get(':hash')
  findByHash(@Param('hash') hash: string) {
    return this.trackersService.findByHash(hash);
  }

  @Get(':hash/games')
  findGamesByHash(@Param('hash') hash: string) {
    //TODO get games by hash
  }

  @Patch(':hash')
  update(
    @Param('hash') hash: string,
    @Body() updateTrackerDto: UpdateTrackerDto,
  ) {
    return this.trackersService.update(hash, updateTrackerDto);
  }

  @Delete(':hash')
  remove(@Param('hash') hash: string) {
    return this.trackersService.remove(hash);
  }
}
