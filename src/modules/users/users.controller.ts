import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../../decorators/public';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a user' })
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByMail(createUserDto.mail);

    if (user) {
      throw new HttpException(
        'This email is already used',
        HttpStatus.CONFLICT,
      );
    }

    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: "Get current user's infos" })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBearerAuth()
  @Get('/me')
  async findOne(@Req() request) {
    const user = await this.usersService.findOneById(request.user.id);

    if (null === user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current user's infos" })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiNoContentResponse({ description: 'User updated successfully' })
  @HttpCode(204)
  @Patch('/me')
  async update(@Req() request, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findOneById(request.user.id);

    if (null === user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMailExistAlready = await this.usersService.findOneByMail(
      updateUserDto.mail,
    );

    if (isMailExistAlready) {
      throw new HttpException(
        'This email is already used',
        HttpStatus.CONFLICT,
      );
    }

    return this.usersService.update(user, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current user's password" })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiNoContentResponse({ description: 'Password updated successfully' })
  @HttpCode(204)
  @Patch('/me/password')
  async updatePassword(
    @Req() request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.usersService.findOneById(request.user.id);

    if (null === user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const match = await this.usersService.comparePassword(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!match) {
      throw new HttpException(
        'Wrong password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.usersService.updatePassword(user, updatePasswordDto.newPassword);
  }

  @ApiOperation({ summary: 'Remove current user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBearerAuth()
  @HttpCode(204)
  @Delete('/me')
  async remove(@Req() request) {
    const user = await this.usersService.findOneById(request.user.id);

    if (null === user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.usersService.remove(user);
  }
}
