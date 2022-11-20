import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Req,
  HttpCode,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResourceNotFoundException } from '../../exceptions/ResourceNotFoundException';
import { MissingTagException } from '../../exceptions/MissingTagException';

@ApiBearerAuth()
@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOperation({ summary: 'Create a game for a tracker' })
  @Post()
  async create(@Req() request, @Body() createGameDto: CreateGameDto) {
    try {
      return await this.gamesService.create(createGameDto, request.user.id);
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  /*
   * Take the tag from the tracker to find games from Brawl Star api.
   */
  @ApiOperation({ summary: 'Get games from Brawl Stars api' })
  @Get(':id/suggest')
  async findSuggest(@Param('id') id: string) {
    try {
      return await this.gamesService.findSuggest(+id);
    } catch (error) {
      if (error instanceof MissingTagException) {
        throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }

  @ApiOperation({ summary: "Get game's info" })
  @ApiNotFoundResponse({ description: 'Game not found' })
  @Get(':id')
  async findOne(@Req() request, @Param('id') id: string) {
    try {
      return await this.gamesService.findOneById(request.user.id, +id);
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  @ApiOperation({ summary: 'Update a game' })
  @ApiNotFoundResponse({ description: 'Game not found' })
  @ApiNoContentResponse({ description: 'Game updated successfully' })
  @HttpCode(204)
  @Patch(':id')
  async update(
    @Req() request,
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    try {
      return await this.gamesService.update(
        request.user.id,
        +id,
        updateGameDto,
      );
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  @ApiOperation({ summary: 'Remove a game' })
  @ApiNotFoundResponse({ description: 'Game not found' })
  @ApiNoContentResponse({ description: 'Game deleted successfully' })
  @HttpCode(204)
  @Delete(':id')
  async remove(@Req() request, @Param('id') id: string) {
    try {
      return await this.gamesService.remove(request.user.id, +id);
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }
}
