import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackersModule } from './trackers/trackers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './games/games.module';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    TrackersModule,
    UsersModule,
    AuthModule,
    GamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
