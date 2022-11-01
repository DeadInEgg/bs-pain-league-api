import { Module } from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { TrackersController } from './trackers.controller';
import { Tracker } from './entities/tracker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Tracker])],
  controllers: [TrackersController],
  providers: [TrackersService],
  exports: [TrackersService],
})
export class TrackersModule {}
