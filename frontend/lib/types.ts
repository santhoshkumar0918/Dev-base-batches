export interface Station {
  id: string;
  name: string;
  address: string;
  status: "Available" | "Busy" | "Limited" | "Offline";
  power: number;
  queue: number;
  waitTime: number;
  availableIn?: number;
  distanceFromRoute: number;
  rate: number;
  connectorTypes?: string[];
  amenities?: string[];
  hasWaiting?: boolean;
  lat?: number;
  lng?: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  batteryCapacity: number;
  range: number;
  consumption: number;
  photo?: string;
}

export interface Route {
  startLocation: string;
  destination: string;
  distance: number;
  duration: string;
  needsCharging?: boolean;
  recommendedStations: Station[];
}
