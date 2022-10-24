import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerModule } from './tracker/tracker.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TrackerModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
