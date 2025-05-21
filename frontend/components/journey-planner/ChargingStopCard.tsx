import { BatteryCharging, Clock, Coffee, Wifi, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

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

interface ChargingStopCardProps {
  station: ChargingStation;
  isLast: boolean;
}

export default function ChargingStopCard({ station, isLast }: ChargingStopCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const bookSlot = () => {
    setIsBooked(true);
  };
  
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'café':
      case 'restaurant':
      case 'food':
        return <Coffee className="h-4 w-4" />;
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getAvailabilityColor = () => {
    if (station.availability > 1) return 'text-green-600 bg-green-50';
    if (station.availability === 1) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-center">
          <div className="bg-green-100 rounded-full p-2 mr-4">
            <BatteryCharging className="h-5 w-5 text-green-600" />
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">{station.name}</h4>
            <p className="text-sm text-gray-600">{station.location}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-right mr-4">
            <div className="text-sm font-medium">
              {station.arrivalTime} - {station.departureTime}
            </div>
            <div className="text-xs text-gray-500">
              {station.chargingTime} min charge {station.waitTime > 0 ? `+ ${station.waitTime} min wait` : ''}
            </div>
          </div>
          
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Station Details</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Distance from start</span>
                  <span className="text-sm font-medium">{station.distance} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estimated arrival time</span>
                  <span className="text-sm font-medium">{station.arrivalTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Charging duration</span>
                  <span className="text-sm font-medium">{station.chargingTime} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current availability</span>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getAvailabilityColor()}`}>
                    {station.availability} {station.availability === 1 ? 'slot' : 'slots'} available
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Amenities</h5>
              <div className="flex flex-wrap gap-2">
                {station.amenities.map((amenity) => (
                  <div 
                    key={amenity} 
                    className="flex items-center bg-white px-3 py-1 rounded border border-gray-200 text-sm"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="ml-1">{amenity}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Booking Status</h5>
                {isBooked ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Reserved for {station.arrivalTime}</span>
                  </div>
                ) : (
                  <button
                    onClick={bookSlot}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Reserve Charging Slot
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {station.waitTime > 0 && (
            <div className="mt-4 flex items-start p-3 bg-amber-50 rounded-md border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Wait time expected:</span> There {station.waitTime === 1 ? 'is' : 'are'} currently {station.waitTime} {station.waitTime === 1 ? 'minute' : 'minutes'} of waiting time at this station.
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Reserving a slot will minimize your wait time. You'll earn eco-points for waiting if the station is busy.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!isLast && (
        <div className="border-t border-gray-100 px-4 py-2 flex items-center">
          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            <Clock className="h-3 w-3 text-gray-400" />
          </div>
          <span className="text-xs text-gray-500">Continue driving for approximately 3h 15m to next stop</span>
        </div>
      )}
    </div>
  );
}