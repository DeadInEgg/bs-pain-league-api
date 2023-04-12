import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Map } from './entities/map.entity';
import { Mode } from './entities/mode.entity';
import { Type } from './entities/type.entity';
import { TrackersModule } from '../trackers/trackers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Fighter } from './entities/fighter.entity';
import { FightersService } from './fighters.service';
import { Brawler } from '../brawler/entities/brawler.entity';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';
import { ModesService } from './modes.services';
import { ModesController } from './modes.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('API_BS_URL'),
        headers: {
          Authorization: `Bearer ${configService.get('API_BS_TOKEN')}`,
        },
      }),
      inject: [ConfigService],
    }),
    TrackersModule,
    TypeOrmModule.forFeature([Game, Map, Mode, Type, Fighter, Brawler]),
  ],
  controllers: [GamesController, MapsController, ModesController],
  providers: [GamesService, FightersService, MapsService, ModesService],
})
export class GamesModule {}
