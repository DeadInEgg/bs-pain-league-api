import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Map } from './entities/map.entity';
import { Mode } from './entities/mode.entity';
import { Type } from './entities/type.entity';
import { TrackersModule } from 'src/modules/trackers/trackers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    TypeOrmModule.forFeature([Game, Map, Mode, Type]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
