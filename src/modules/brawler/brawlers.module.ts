import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brawler } from './entities/brawler.entity';
import { BrawlersController } from './brawlers.controller';
import { BrawlersService } from './brawlers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brawler])],
  controllers: [BrawlersController],
  providers: [BrawlersService],
})
export class BrawlersModule {}
