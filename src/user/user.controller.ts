import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTrackerDto } from 'src/tracker/dto/create-tracker.dto';
import { TrackerService } from 'src/tracker/tracker.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly trackerService: TrackerService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post(':id/tracker')
  async createTrackerWithUser(
    @Body() createTrackerWithUserDto: CreateTrackerDto,
  ) {
    const user = await this.userService.findOne(
      createTrackerWithUserDto.userId,
    );
    return this.trackerService.create(createTrackerWithUserDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get(':id/trackers')
  findTrackersByUserId(@Param('id') id: string) {
    return this.trackerService.findByUserId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }
}
