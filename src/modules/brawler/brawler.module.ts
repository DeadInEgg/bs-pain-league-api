import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brawler } from './entities/brawler.entity';
import { BrawlerController } from './brawler.controller';
import { BrawlerService } from './brawler.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brawler])],
  controllers: [BrawlerController],
  providers: [BrawlerService],
})
export class BrawlerModule {}
