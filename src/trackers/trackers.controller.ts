import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { UsersService } from 'src/users/users.service';

@Controller('trackers')
export class TrackersController {
  constructor(
    private readonly trackersService: TrackersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Req() request, @Body() createTrackerDto: CreateTrackerDto) {
    const user = await this.usersService.findByMail(request.user.mail);
    return this.trackersService.create(createTrackerDto, user);
  }

  @Get()
  findByCurrentUser(@Req() request) {
    return this.trackersService.findByUserId(request.user.id);
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
