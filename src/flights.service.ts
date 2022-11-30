import { Injectable, Query } from '@nestjs/common';
import * as fs from 'fs';

interface IflightItinerary {
  flight_id: string;
  depatureDestination: string;
  arrivalDestination: string;
  itineraries: [];
}

const getJson = () => {
  const data = fs.readFileSync('./src/data.json', 'utf8');
  const jsonData = JSON.parse(data);
  return jsonData;
};

const filterData = async (tripSearch: string) => {
  const arrayOfData = tripSearch.split(',');
  const oneWay = arrayOfData[2];
  const allFlightsData = await getJson();
  if (oneWay === 'false') {
    const fromCity = arrayOfData[0];
    const toCity = arrayOfData[1];
    const fromDate = arrayOfData[4];
    const toDate = arrayOfData[5];
    const trip1: IflightItinerary = allFlightsData.filter(
      (flight: { depatureDestination: string; arrivalDestination: string }) =>
        flight.depatureDestination === fromCity &&
        flight.arrivalDestination === toCity,
    )[0];
    const trip1Id = trip1.flight_id;
    const firstWayTrips = trip1.itineraries.filter(
      (flight: { depatureAt: string }) =>
        fromDate === flight.depatureAt.split('T')[0],
    );
    const trip2: IflightItinerary = allFlightsData.filter(
      (flight: { depatureDestination: string; arrivalDestination: string }) =>
        flight.arrivalDestination === fromCity &&
        flight.depatureDestination === toCity,
    )[0];
    const trip2Id = trip2.flight_id;
    const secondWayTrips = trip2.itineraries.filter(
      (flight: { depatureAt: string }) =>
        toDate === flight.depatureAt.split('T')[0],
    );
    return [
      { trip1Id, firstWayTrips, fromCity, toCity },
      { trip2Id, secondWayTrips, fromCity, toCity },
    ];
  }
  if (oneWay === 'true') {
    const fromCity = arrayOfData[0];
    const toCity = arrayOfData[1];
    const fromDate = arrayOfData[4];
    const trip1: IflightItinerary = allFlightsData.filter(
      (flight: { depatureDestination: string; arrivalDestination: string }) =>
        flight.depatureDestination === fromCity &&
        flight.arrivalDestination === toCity,
    )[0];
    const trip1Id = trip1.flight_id;
    const firstWayTrips = trip1.itineraries.filter(
      (flight: { depatureAt: string }) =>
        fromDate === flight.depatureAt.split('T')[0],
    );
    return [{ trip1Id, firstWayTrips, fromCity, toCity }];
  }
};

@Injectable()
export class FlightsService {
  async getFlights(@Query() query: { tripSearch: string }) {
    const tripSearch: string = query.tripSearch;
    const flightRequestData = await filterData(tripSearch);
    if (flightRequestData !== undefined) return flightRequestData;
    if (flightRequestData === undefined) return { error: 'there was an error' };
  }
}
