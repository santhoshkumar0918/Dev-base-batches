import { MapPin, Navigation, BatteryCharging } from 'lucide-react';

interface ChargingStation {
  id: string;
  name: string;
  location: string;
  distance: number;
  availability: number;
  waitTime: number;
  chargingTime: number;
  arrivalTime: string;
  departureTime: string;
  amenities: string[];
}

interface JourneyMapProps {
  origin: string;
  destination: string;
  chargingStops: ChargingStation[];
}

export default function JourneyMap({ origin, destination, chargingStops }: JourneyMapProps) {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden h-full min-h-96 relative">
      {/* Placeholder for the actual map - in a real app, this would be integrated with a mapping library */}
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <div className="absolute inset-0 flex flex-col">
          {/* This is a visual representation of the journey path */}
          <div className="relative flex-1 px-6 py-4">
            {/* Origin marker */}
            <div className="absolute top-4 left-8 flex items-center">
              <div className="bg-blue-500 rounded-full p-2">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div className="ml-2 bg-white px-3 py-1 rounded-md shadow-sm">
                <span className="text-sm font-medium">{origin}</span>
              </div>
            </div>
            
            {/* Journey path line */}
            <div className="absolute left-10 top-12 bottom-12 w-1 bg-gray-300 z-0">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" style={{ height: '100%' }}></div>
            </div>
            
            {/* Charging stops */}
            {chargingStops.map((stop, index) => {
              // Calculate position along the path based on distance
              const position = (stop.distance / 500) * 100; // 500 is the total journey distance
              
              return (
                <div key={stop.id} className="absolute left-8" style={{ top: `${12 + position * 0.76}%` }}>
                  <div className="flex items-center">
                    <div className="bg-green-500 rounded-full p-2 z-10">
                      <BatteryCharging className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-2 bg-white px-3 py-1 rounded-md shadow-sm">
                      <span className="text-sm font-medium">{stop.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Destination marker */}
            <div className="absolute bottom-4 left-8 flex items-center">
              <div className="bg-red-500 rounded-full p-2">
                <Navigation className="h-4 w-4 text-white" />
              </div>
              <div className="ml-2 bg-white px-3 py-1 rounded-md shadow-sm">
                <span className="text-sm font-medium">{destination}</span>
              </div>
            </div>
          </div>
          
          {/* Map attribution and controls placeholder */}
          <div className="bg-white p-2 border-t border-gray-200 flex justify-between items-center">
            <div className="text-xs text-gray-500">Interactive map • Tap to expand</div>
            <div className="flex space-x-2">
              <button className="p-1 bg-gray-100 rounded hover:bg-gray-200">
                <span className="sr-only">Zoom in</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button className="p-1 bg-gray-100 rounded hover:bg-gray-200">
                <span className="sr-only">Zoom out</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center z-10 bg-white px-4 py-2 rounded-lg shadow-md">
          <p className="text-gray-500">Map visualization will appear here</p>
          <p className="text-xs text-gray-400">Integrate with mapping library for production use</p>
        </div>
      </div>
    </div>
  );
}