// "use client";

// import { useState } from "react";
// import RouteMap from "@/components/layout/journeyRouteMap";
// import RouteForm from "@/components/layout/journeyRouteForm";
// import BatteryMonitor from "@/components/layout/journeyBatteryMonitor";
// import ChargingStations from "@/components/layout/journeyChargingStations";
// import ReservationSystem from "@/components/layout/journeyReservationSystem";
// import DashboardLayout from "@/components/layout/DashboardLayout";
// import { Route, Vehicle, Station } from "@/lib/types";

// export default function JourneyPlanner() {
//   const [route, setRoute] = useState<Route | null>(null);
//   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//   const [batteryStatus, setBatteryStatus] = useState(80);
//   const [selectedStation, setSelectedStation] = useState<Station | null>(null);

//   return (
//     <DashboardLayout>
//       <div className="py-6">
//         <div className="container mx-auto px-4">
//           <h1 className="text-2xl font-bold mb-6">Journey Planner</h1>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left sidebar - Route form and Battery */}
//             <div className="space-y-6">
//               <RouteForm
//                 onRouteSet={setRoute}
//                 onVehicleSelect={setSelectedVehicle}
//               />

//               <BatteryMonitor
//                 percentage={batteryStatus}
//                 vehicle={selectedVehicle}
//                 route={route}
//               />
//             </div>

//             {/* Center - Map with route and stations */}
//             <div className="lg:col-span-2">
//               <RouteMap
//                 route={route}
//                 batteryStatus={batteryStatus}
//                 vehicle={selectedVehicle}
//                 onStationSelect={setSelectedStation}
//               />
//             </div>
//           </div>

//           {/* Charging stations section */}
//           {route && (
//             <div className="mt-8">
//               <h2 className="text-xl font-bold mb-4">
//                 Recommended Charging Stations
//               </h2>
//               <ChargingStations
//                 route={route}
//                 vehicle={selectedVehicle}
//                 batteryStatus={batteryStatus}
//                 onStationSelect={setSelectedStation}
//               />
//             </div>
//           )}

//           {/* Reservation section */}
//           {selectedStation && (
//             <div className="mt-8">
//               <h2 className="text-xl font-bold mb-4">Station Reservation</h2>
//               <ReservationSystem station={selectedStation} />
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }




'use client';

import { useState } from 'react';
import { Search, Calendar, Battery, MapPin, Clock, ChevronRight, Car } from 'lucide-react';
import JourneyMap from '@/components/journey-planner/JourneyMap';
import VehicleSelector from '@/components/journey-planner/VehicleSelector';
import BatteryLevelSelector from '@/components/journey-planner/BatteryLevelSelector';
import ChargingStopCard from '@/components/journey-planner/ChargingStopCard';
import JourneySummary from '@/components/journey-planner/JourneySummary';

// Mock data for charging stations
const mockChargingStations = [
  {
    id: 'cs1',
    name: 'Highway EnergyHub',
    location: 'Highway NH45, Villupuram',
    distance: 120,
    availability: 2,
    waitTime: 0,
    chargingTime: 25,
    arrivalTime: '12:45 PM',
    departureTime: '1:10 PM',
    amenities: ['Restroom', 'Café', 'WiFi']
  },
  {
    id: 'cs2',
    name: 'GreenCharge Madurai',
    location: 'Madurai Bypass Road',
    distance: 320,
    availability: 1,
    waitTime: 15,
    chargingTime: 30,
    arrivalTime: '4:20 PM',
    departureTime: '5:05 PM',
    amenities: ['Restaurant', 'Shopping', 'Restroom']
  }
];

export default function JourneyPlanner() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [journeyPlanned, setJourneyPlanned] = useState(false);
  const [departureTime, setDepartureTime] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  
  const handlePlanJourney = () => {
    // Validate inputs
    if (!origin || !destination || !selectedVehicle || !departureTime || !departureDate) {
      alert('Please fill in all the required fields');
      return;
    }
    setJourneyPlanned(true);
  };

  const resetJourney = () => {
    setJourneyPlanned(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Journey Planner</h1>
        
        {!journeyPlanned ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter starting point"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                  <VehicleSelector 
                    selectedVehicle={selectedVehicle} 
                    setSelectedVehicle={setSelectedVehicle} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Battery Level</label>
                  <BatteryLevelSelector 
                    batteryLevel={batteryLevel} 
                    setBatteryLevel={setBatteryLevel} 
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handlePlanJourney}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Plan Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Journey Details</h2>
                  <p className="text-gray-600 mt-1">
                    {origin} to {destination} • {departureDate} • {departureTime}
                  </p>
                </div>
                <button
                  onClick={resetJourney}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit Journey
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <JourneyMap 
                    origin={origin} 
                    destination={destination} 
                    chargingStops={mockChargingStations} 
                  />
                </div>
                
                <div className="space-y-4">
                  <JourneySummary 
                    origin={origin}
                    destination={destination}
                    distance={500}
                    totalTime="7h 30m"
                    departureTime={departureTime}
                    arrivalTime="6:30 PM"
                    batteryConsumption={85}
                    chargingStops={mockChargingStations.length}
                    selectedVehicle={selectedVehicle}
                    initialBatteryLevel={batteryLevel}
                  />
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800">Journey Optimization</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      This route includes optimal charging stops to minimize your total travel time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Charging Stops</h3>
              <div className="space-y-4">
                {mockChargingStations.map((station, index) => (
                  <ChargingStopCard 
                    key={station.id}
                    station={station}
                    isLast={index === mockChargingStations.length - 1}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Confirm & Book Charging Slots
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}