import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  create(@Body() createTrackerDto: CreateTrackerDto) {
    return this.trackerService.create(createTrackerDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackerService.findOne(+id);
  }

  @Get(':hash')
  findByHash(@Param('hash') hash: string) {
    return this.trackerService.findByHash(hash);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackerDto: UpdateTrackerDto) {
    return this.trackerService.update(+id, updateTrackerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackerService.remove(+id);
  }
}
