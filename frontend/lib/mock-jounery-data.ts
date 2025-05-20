export const mockVehicles = [
  {
    id: "nexon-ev",
    make: "Tata",
    model: "Nexon EV",
    batteryCapacity: 40.5, // kWh
    range: 312, // km
    consumption: 13.0, // kWh/100km
    photo: "/vehicles/nexon-ev.jpg",
  },
  {
    id: "zs-ev",
    make: "MG",
    model: "ZS EV",
    batteryCapacity: 50.3,
    range: 461,
    consumption: 10.9,
    photo: "/vehicles/zs-ev.jpg",
  },
  {
    id: "kona-electric",
    make: "Hyundai",
    model: "Kona Electric",
    batteryCapacity: 39.2,
    range: 305,
    consumption: 12.9,
    photo: "/vehicles/kona-electric.jpg",
  },
  {
    id: "tigor-ev",
    make: "Tata",
    model: "Tigor EV",
    batteryCapacity: 26.0,
    range: 306,
    consumption: 8.5,
    photo: "/vehicles/tigor-ev.jpg",
  },
];

export const mockChargingStations = [
  {
    id: "station-1",
    name: "Lonavala Municipal Station",
    address: "23, MG Road, Lonavala, Maharashtra",
    power: 50, // kW
    status: "Available",
    queue: 0,
    waitTime: 0,
    availableIn: 0,
    distanceFromRoute: 0.3,
    rate: 16, // Rs per kWh
    lat: 18.7546,
    lng: 73.4018,
    connectorTypes: ["CCS2", "CHAdeMO"],
    amenities: ["Restroom", "Cafe"],
    hasWaiting: false,
  },
  {
    id: "station-2",
    name: "Hotel Midway Charging Point",
    address: "Mumbai-Pune Highway, Khopoli",
    power: 25,
    status: "Busy",
    queue: 2,
    waitTime: 35,
    availableIn: 20,
    distanceFromRoute: 0.8,
    rate: 14,
    lat: 18.7864,
    lng: 73.3451,
    connectorTypes: ["CCS2"],
    amenities: ["Restroom", "Restaurant", "WiFi"],
    hasWaiting: true,
  },
  {
    id: "station-3",
    name: "Expressway Fast Charging Hub",
    address: "Food Mall, Mumbai-Pune Expressway",
    power: 150,
    status: "Limited",
    queue: 1,
    waitTime: 15,
    availableIn: 10,
    distanceFromRoute: 0.1,
    rate: 18,
    lat: 18.8234,
    lng: 73.2987,
    connectorTypes: ["CCS2", "CHAdeMO", "Type 2"],
    amenities: ["Restroom", "Food Court", "WiFi", "Shopping"],
    hasWaiting: true,
  },
];

export function mockCalculateRoute(
  startLocation: string,
  destination: string,
  vehicle: any
) {
  // Create a mock route calculation
  // In a real app, this would be an API call to a mapping service

  const distance =
    startLocation.toLowerCase().includes("mumbai") &&
    destination.toLowerCase().includes("pune")
      ? 150
      : startLocation.toLowerCase().includes("pune") &&
        destination.toLowerCase().includes("mumbai")
      ? 150
      : startLocation.toLowerCase().includes("delhi") &&
        destination.toLowerCase().includes("jaipur")
      ? 268
      : Math.floor(Math.random() * 300) + 50; // Random distance between 50-350 km

  const duration = Math.floor(distance * 1.2) + " min"; // Simple estimate

  // Calculate how many and which charging stations would be needed
  // based on the vehicle range and route distance
  const needsCharging = vehicle.range < distance;
  const stationsNeeded = Math.ceil(distance / vehicle.range);

  // Select random stations from our mock data
  const recommendedStations = [];
  if (needsCharging) {
    // Clone to avoid mutating the original data
    const availableStations = [...mockChargingStations];

    // Add stations at reasonable intervals along the route
    for (let i = 0; i < stationsNeeded; i++) {
      if (availableStations.length === 0) break;

      // Pick a random station and remove it from available options
      const randomIndex = Math.floor(Math.random() * availableStations.length);
      const station = availableStations.splice(randomIndex, 1)[0];

      // Adjust station position along the route
      const stationDistanceFromStart = Math.floor(
        (i + 1) * vehicle.range * 0.8
      );

      recommendedStations.push({
        ...station,
        distanceFromStart: stationDistanceFromStart,
      });
    }
  }

  return {
    startLocation,
    destination,
    distance,
    duration,
    needsCharging,
    recommendedStations,
  };
}

// Sample journey data
export const mockJourneyData = {
  route: {
    startLocation: "Mumbai",
    destination: "Pune",
    distance: 150,
    duration: "3h 10m",
    needsCharging: true,
    recommendedStations: mockChargingStations,
  },

  batteryStatus: {
    currentPercentage: 70,
    estimatedRange: 210,
    chargingStopsNeeded: 1,
  },

  realTimeUpdates: [
    {
      type: "battery",
      message:
        "Battery consumption higher than estimated due to air conditioning. Consider an additional 10-minute charge.",
      timestamp: new Date().toISOString(),
    },
    {
      type: "station",
      message:
        "Lonavala Municipal Station now busy with 2 vehicles in queue. Hotel Midway is available.",
      timestamp: new Date().toISOString(),
    },
    {
      type: "traffic",
      message: "Heavy traffic reported ahead. Estimated arrival time adjusted.",
      timestamp: new Date().toISOString(),
    },
  ],
};
