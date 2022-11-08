import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors
} from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { UsersService } from 'src/modules/users/users.service';
import {ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Trackers')
@Controller('trackers')
export class TrackersController {
  constructor(
    private readonly trackersService: TrackersService,
    private readonly usersService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Create a tracker for the current logged user" })
  @Post()
  async create(@Req() request, @Body() createTrackerDto: CreateTrackerDto) {
    const user = await this.usersService.findOneByMail(request.user.mail);

    if (null === user) {
      throw new HttpException('Invalid bearer token', HttpStatus.UNAUTHORIZED)
    }

    return this.trackersService.create(createTrackerDto, user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: "Get a list of trackers for the current logged user" })
  @Get()
  findByCurrentUser(@Req() request) {
    return this.trackersService.findByUserId(request.user.id);
  }

  @ApiNotFoundResponse({ description: "Tracker not found" })
  @ApiOperation({ summary: "Get tracker's infos" })
  @Get(':hash')
  async findByHash(@Param('hash') hash: string, @Req() request) {
    const tracker = await this.trackersService.findOneByHashAndUserIdWithGames(hash, request.user.id);

    if (null === tracker) {
      throw new HttpException('Tracker not found', HttpStatus.NOT_FOUND);
    }

    return tracker;
  }

  @ApiNotFoundResponse({ description: "Tracker not found" })
  @ApiOperation({ summary: "Update a tracker" })
  @Patch(':hash')
  async update(
    @Req() request,
    @Param('hash') hash: string,
    @Body() updateTrackerDto: UpdateTrackerDto,
  ) {
    const tracker = await this.trackersService.findOneByHashAndUser(hash, request.user.id);

    if (null === tracker) {
      throw new HttpException('Tracker not found', HttpStatus.NOT_FOUND);
    }

    return this.trackersService.update(tracker, updateTrackerDto);
  }

  @ApiNotFoundResponse({ description: "Tracker not found" })
  @ApiOperation({ summary: "Remove a tracker" })
  @Delete(':hash')
  async remove(@Req() request, @Param('hash') hash: string) {
    const tracker = await this.trackersService.findOneByHashAndUser(hash, request.user.id);

    if (null === tracker) {
      throw new HttpException('Tracker not found', HttpStatus.NOT_FOUND);
    }

    return this.trackersService.remove(tracker);
  }
}
