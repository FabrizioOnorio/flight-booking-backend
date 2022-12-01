import { Body, Injectable, Query } from '@nestjs/common';
import { request } from 'http';
import filterData, { updateSeats } from './utils';

export interface IRequestUpdate {
  body: string;
}

@Injectable()
export class FlightsService {
  async getFlights(@Query() query: { tripSearch: string }) {
    const tripSearch: string = query.tripSearch;
    const flightRequestData = await filterData(tripSearch);
    if (flightRequestData !== undefined) return flightRequestData;
    if (flightRequestData === undefined) return { error: 'there was an error' };
  }

  updateSeats(@Body() body: string) {
    updateSeats(body);
    return 'db updated';
  }
}
