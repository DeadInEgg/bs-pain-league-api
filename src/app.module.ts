import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackersModule } from './modules/trackers/trackers.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './modules/games/games.module';
import { dataSourceOptions } from './data-source';
import { BrawlerModule } from './modules/brawler/brawler.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    TrackersModule,
    UsersModule,
    AuthModule,
    GamesModule,
    BrawlerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
