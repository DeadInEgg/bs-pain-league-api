import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracker } from './trackers/entities/tracker.entity';
import { TrackersModule } from './trackers/trackers.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './games/games.module';
import { Game } from './games/entities/game.entity';
import { Map } from './games/entities/map.entity';
import { Type } from './games/entities/type.entity';
import { Mode } from './games/entities/mode.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Tracker, Game, Map, Type, Mode],
      synchronize: true,
    }),
    TrackersModule,
    UsersModule,
    AuthModule,
    GamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
