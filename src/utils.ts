import * as fs from 'fs';

interface IflightItinerary {
  flight_id: string;
  depatureDestination: string;
  arrivalDestination: string;
  itineraries: [];
}

const sleep = (milliseconds: number) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

const getJson = async () => {
  const data = fs.readFileSync('./src/data.json', 'utf8');
  const jsonData = JSON.parse(data);
  sleep(3000);
  return await jsonData;
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

export const updateSeats = async (body: any) => {
  const parsedData = body;
  const flightOneDepartureCity = parsedData.bookedFlights[0].departureCity;
  const flightOneArrivalCity = parsedData.bookedFlights[0].arrivalCity;
  const flightTwoDepartureCity = parsedData.bookedFlights[1].arrivalCity;
  const flightTwoArrivalCity = parsedData.bookedFlights[1].departureCity;
  const flighOneDepartureAt = parsedData.bookedFlights[0].completeDate;
  const flighTwoDepartureAt = parsedData.bookedFlights[1].completeDate;
  const bookedSeatsFlightOne =
    parsedData.bookedFlights[0].adultsBooked +
    parsedData.bookedFlights[0].childrenBooked;
  const bookedSeatsFlightTwo =
    parsedData.bookedFlights[1].adultsBooked +
    parsedData.bookedFlights[1].childrenBooked;
  const data = fs.readFileSync('./src/data.json', 'utf8');
  const dbData = JSON.parse(data);
  const firstTripToUpdateIndex = dbData.findIndex(
    (x: { depatureDestination: string; arrivalDestination: string }) =>
      flightOneDepartureCity === x.depatureDestination &&
      flightOneArrivalCity === x.arrivalDestination,
  );
  const firstFlightItineraryindex = dbData[
    firstTripToUpdateIndex
  ].itineraries.findIndex(
    (y: { depatureAt: string }) => y.depatureAt === flighOneDepartureAt,
  );
  const secondTripToUpdateIndex = dbData.findIndex(
    (x: { depatureDestination: string; arrivalDestination: string }) =>
      flightTwoDepartureCity === x.depatureDestination &&
      flightTwoArrivalCity === x.arrivalDestination,
  );
  const secondFlightItineraryindex = dbData[
    secondTripToUpdateIndex
  ].itineraries.findIndex(
    (y: { depatureAt: string }) => y.depatureAt === flighTwoDepartureAt,
  );

  const firstTripSeats =
    dbData[firstTripToUpdateIndex].itineraries[firstFlightItineraryindex]
      .avaliableSeats;
  const secondTripSeats =
    dbData[secondTripToUpdateIndex].itineraries[secondFlightItineraryindex]
      .avaliableSeats;

  dbData[firstTripToUpdateIndex].itineraries[
    firstFlightItineraryindex
  ].avaliableSeats = firstTripSeats - bookedSeatsFlightOne;
  dbData[secondTripToUpdateIndex].itineraries[
    secondFlightItineraryindex
  ].avaliableSeats = secondTripSeats - bookedSeatsFlightTwo;

  fs.writeFileSync('./src/data.json', JSON.stringify(dbData));
};

export default filterData;
