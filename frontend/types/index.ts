export interface ChargingStation {
  id: string;
  name: string;
  location: string;
  distance: number;  // Distance from origin in km
  availability: number;  // Number of available charging points
  waitTime: number;  // Expected wait time in minutes
  chargingTime: number;  // Expected charging time in minutes
  arrivalTime: string;  // Estimated arrival time
  departureTime: string;  // Estimated departure time after charging
  amenities: string[];  // Available amenities at the station
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EVVehicle {
  id: string;
  name: string;
  range: number;  // Range in km on full charge
  batteryCapacity: number;  // Battery capacity in kWh
  chargingSpeed?: number;  // Charging speed in kW
  efficiency?: number;  // Energy consumption in kWh/100km
  image?: string;  // Vehicle image URL
}

export interface JourneyPlan {
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  batteryConsumption: number;
  chargingStops: ChargingStation[];
  routePolyline?: string;  // Encoded polyline for map rendering
}

export interface BookingSlot {
  stationId: string;
  userId: string;
  arrivalTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  vehicleId: string;
  chargeAmount: number;  // kWh to be charged
}