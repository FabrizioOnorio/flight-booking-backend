import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

@Module({
  controllers: [AppController, FlightsController],
  providers: [AppService, FlightsService],
})
export class AppModule {}
