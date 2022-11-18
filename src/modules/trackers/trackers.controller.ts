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
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { UsersService } from '../users/users.service';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Trackers')
@Controller('trackers')
export class TrackersController {
  constructor(
    private readonly trackersService: TrackersService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Create a tracker for the current logged user' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Req() request, @Body() createTrackerDto: CreateTrackerDto) {
    const user = await this.usersService.findOneByMail(request.user.mail);

    if (null === user) {
      throw new HttpException('Invalid bearer token', HttpStatus.UNAUTHORIZED);
    }

    return this.trackersService.create(createTrackerDto, user);
  }

  @ApiOperation({
    summary: 'Get a list of trackers for the current logged user',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findByCurrentUser(@Req() request) {
    return this.trackersService.findByUserId(request.user.id);
  }

  @ApiOperation({ summary: "Get tracker's infos" })
  @ApiNotFoundResponse({ description: 'Tracker not found' })
  @Get(':hash')
  async findByHash(@Param('hash') hash: string, @Req() request) {
    const tracker = await this.trackersService.findOneByHashAndUserIdWithGames(
      hash,
      request.user.id,
    );

    if (null === tracker) {
      throw new HttpException('Tracker not found', HttpStatus.NOT_FOUND);
    }

    return tracker;
  }

  @ApiOperation({ summary: 'Update a tracker' })
  @ApiNotFoundResponse({ description: 'Tracker not found' })
  @ApiNoContentResponse({description: 'Tracker updated successfully'})
  @HttpCode(204)
  @Patch(':hash')
  async update(
    @Req() request,
    @Param('hash') hash: string,
    @Body() updateTrackerDto: UpdateTrackerDto,
  ) {
    const tracker = await this.trackersService.findOneByHashAndUserId(
      hash,
      request.user.id
    );

    if (null === tracker) {
      throw new HttpException('Tracker not found', HttpStatus.NOT_FOUND);
    }

    await this.trackersService.update(tracker, updateTrackerDto);
  }

  @ApiOperation({ summary: 'Remove a tracker' })
  @ApiNotFoundResponse({ description: 'Tracker not found' })
  @HttpCode(204)
  @Delete(':hash')
  async remove(@Req() request, @Param('hash') hash: string) {
    const tracker = await this.trackersService.findOneByHashAndUserId(
      hash,
      request.user.id
    );

    if (null === tracker) {
      throw new HttpException('Tracker not found', HttpStatus.NOT_FOUND);
    }

    await this.trackersService.remove(tracker);
  }
}
