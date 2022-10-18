import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerModule } from './tracker/tracker.module';

@Module({
  imports: [TrackerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
