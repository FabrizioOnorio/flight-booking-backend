import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('/api/flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  getFlights(@Query() query: { tripSearch: string }) {
    return this.flightsService.getFlights(query);
  }
  @Put()
  updateSeats(@Body() body: string) {
    return this.flightsService.updateSeats(body);
  }
}
