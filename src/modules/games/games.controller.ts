import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  ParseIntPipe,
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
import { Game } from './entities/game.entity';

@ApiBearerAuth()
@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOperation({ summary: 'Create a game for a tracker' })
  @Post()
  async create(
    @Req() request,
    @Body() createGameDto: CreateGameDto,
  ): Promise<Game> {
    return this.gamesService.create(createGameDto, request.user.id);
  }

  /*
   * Take the tag from the tracker to find games from Brawl Star api.
   */
  @ApiOperation({ summary: 'Get games from Brawl Stars api' })
  @Get('/suggest/:trackerHash')
  async findSuggest(
    @Req() request,
    @Param('trackerHash') trackHash: string,
  ): Promise<Game[]> {
    return this.gamesService.findSuggest(trackHash, request.user.id);
  }

  @ApiOperation({ summary: "Get game's info" })
  @ApiNotFoundResponse({ description: 'Game not found' })
  @Get(':id')
  async findOne(
    @Req() request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Game> {
    return this.gamesService.findOneById(request.user.id, id);
  }

  @ApiOperation({ summary: 'Update a game' })
  @ApiNotFoundResponse({ description: 'Game not found' })
  @ApiNoContentResponse({ description: 'Game updated successfully' })
  @HttpCode(204)
  @Patch(':id')
  async update(
    @Req() request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<Game> {
    return this.gamesService.update(updateGameDto, request.user.id, id);
  }

  @ApiOperation({ summary: 'Remove a game' })
  @ApiNotFoundResponse({ description: 'Game not found' })
  @ApiNoContentResponse({ description: 'Game deleted successfully' })
  @HttpCode(204)
  @Delete(':id')
  async remove(
    @Req() request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Game> {
    return this.gamesService.remove(request.user.id, +id);
  }
}
