import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('/api/flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  getFlights(@Query() query: { tripSearch: string }) {
    return this.flightsService.getFlights(query);
  }
}
