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
import { UsersService } from 'src/modules/users/users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Trackers')
@Controller('trackers')
export class TrackersController {
  constructor(
    private readonly trackersService: TrackersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Req() request, @Body() createTrackerDto: CreateTrackerDto) {
    console.log('0', request.user);
    const user = await this.usersService.findOneByMail(request.user.mail);
    console.log('1', user);
    return this.trackersService.create(createTrackerDto, user);
  }

  @Get()
  findByCurrentUser(@Req() request) {
    return this.trackersService.findByUserId(request.user.id);
  }

  @Get(':hash')
  findByHash(@Param('hash') hash: string) {
    return this.trackersService.findOneByHash(hash);
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
