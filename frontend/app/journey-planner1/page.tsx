// 'use client';

// import { useState } from 'react';
// import { Search, Calendar, Battery, MapPin, Clock, ChevronRight, Car } from 'lucide-react';
// import JourneyMap from '@/components/journey-planner/JourneyMap';
// import VehicleSelector from '@/components/journey-planner/VehicleSelector';
// import BatteryLevelSelector from '@/components/journey-planner/BatteryLevelSelector';
// import ChargingStopCard from '@/components/journey-planner/ChargingStopCard';
// import JourneySummary from '@/components/journey-planner/JourneySummary';

// // Mock data for charging stations
// const mockChargingStations = [
//   {
//     id: 'cs1',
//     name: 'Highway EnergyHub',
//     location: 'Highway NH45, Villupuram',
//     distance: 120,
//     availability: 2,
//     waitTime: 0,
//     chargingTime: 25,
//     arrivalTime: '12:45 PM',
//     departureTime: '1:10 PM',
//     amenities: ['Restroom', 'Café', 'WiFi']
//   },
//   {
//     id: 'cs2',
//     name: 'GreenCharge Madurai',
//     location: 'Madurai Bypass Road',
//     distance: 320,
//     availability: 1,
//     waitTime: 15,
//     chargingTime: 30,
//     arrivalTime: '4:20 PM',
//     departureTime: '5:05 PM',
//     amenities: ['Restaurant', 'Shopping', 'Restroom']
//   }
// ];

// export default function JourneyPlanner() {
//   const [origin, setOrigin] = useState('');
//   const [destination, setDestination] = useState('');
//   const [selectedVehicle, setSelectedVehicle] = useState('');
//   const [batteryLevel, setBatteryLevel] = useState(100);
//   const [journeyPlanned, setJourneyPlanned] = useState(false);
//   const [departureTime, setDepartureTime] = useState('');
//   const [departureDate, setDepartureDate] = useState('');
  
//   const handlePlanJourney = () => {
//     // Validate inputs
//     if (!origin || !destination || !selectedVehicle || !departureTime || !departureDate) {
//       alert('Please fill in all the required fields');
//       return;
//     }
//     setJourneyPlanned(true);
//   };

//   const resetJourney = () => {
//     setJourneyPlanned(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Journey Planner</h1>
        
//         {!journeyPlanned ? (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <MapPin className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter starting point"
//                       value={origin}
//                       onChange={(e) => setOrigin(e.target.value)}
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <MapPin className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter destination"
//                       value={destination}
//                       onChange={(e) => setDestination(e.target.value)}
//                     />
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Calendar className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         type="date"
//                         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         value={departureDate}
//                         onChange={(e) => setDepartureDate(e.target.value)}
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Clock className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         type="time"
//                         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         value={departureTime}
//                         onChange={(e) => setDepartureTime(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
//                   <VehicleSelector 
//                     selectedVehicle={selectedVehicle} 
//                     setSelectedVehicle={setSelectedVehicle} 
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Current Battery Level</label>
//                   <BatteryLevelSelector 
//                     batteryLevel={batteryLevel} 
//                     setBatteryLevel={setBatteryLevel} 
//                   />
//                 </div>
                
//                 <div className="pt-4">
//                   <button
//                     onClick={handlePlanJourney}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                   >
//                     Plan Journey
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">Journey Details</h2>
//                   <p className="text-gray-600 mt-1">
//                     {origin} to {destination} • {departureDate} • {departureTime}
//                   </p>
//                 </div>
//                 <button
//                   onClick={resetJourney}
//                   className="text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Edit Journey
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="lg:col-span-2">
//                   <JourneyMap 
//                     origin={origin} 
//                     destination={destination} 
//                     chargingStops={mockChargingStations} 
//                   />
//                 </div>
                
//                 <div className="space-y-4">
//                   <JourneySummary 
//                     origin={origin}
//                     destination={destination}
//                     distance={500}
//                     totalTime="7h 30m"
//                     departureTime={departureTime}
//                     arrivalTime="6:30 PM"
//                     batteryConsumption={85}
//                     chargingStops={mockChargingStations.length}
//                     selectedVehicle={selectedVehicle}
//                     initialBatteryLevel={batteryLevel}
//                   />
                  
//                   <div className="bg-blue-50 rounded-lg p-4">
//                     <h3 className="text-sm font-medium text-blue-800">Journey Optimization</h3>
//                     <p className="text-sm text-blue-700 mt-1">
//                       This route includes optimal charging stops to minimize your total travel time.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Charging Stops</h3>
//               <div className="space-y-4">
//                 {mockChargingStations.map((station, index) => (
//                   <ChargingStopCard 
//                     key={station.id}
//                     station={station}
//                     isLast={index === mockChargingStations.length - 1}
//                   />
//                 ))}
//               </div>
//             </div>
            
//             <div className="flex justify-center">
//               <button
//                 className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
//               >
//                 Confirm & Book Charging Slots
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, Battery, MapPin, Clock, ChevronRight, Car } from 'lucide-react';
import { ethers } from 'ethers';

// Contract ABIs (you'll need to import these)
const JOURNEY_PLANNER_ABI = [
  // Your JourneyPlanner ABI from the JSON file
  {
    "inputs": [
      {"internalType": "string", "name": "_origin", "type": "string"},
      {"internalType": "string", "name": "_destination", "type": "string"},
      {"internalType": "uint256", "name": "_userVehicleIndex", "type": "uint256"},
      {"internalType": "uint256", "name": "_totalDistance", "type": "uint256"},
      {"internalType": "uint256", "name": "_estimatedTotalTime", "type": "uint256"},
      {"internalType": "uint256", "name": "_departureTime", "type": "uint256"},
      {"internalType": "uint256[]", "name": "_chargingStationIds", "type": "uint256[]"},
      {"components": [
        {"internalType": "uint256", "name": "stationId", "type": "uint256"},
        {"internalType": "uint256", "name": "estimatedArrivalTime", "type": "uint256"},
        {"internalType": "uint256", "name": "estimatedDepartureTime", "type": "uint256"},
        {"internalType": "uint256", "name": "chargingDuration", "type": "uint256"},
        {"internalType": "uint256", "name": "expectedChargeAmount", "type": "uint256"},
        {"internalType": "bool", "name": "isCompleted", "type": "bool"}
      ], "internalType": "struct JourneyPlanner.ChargingStop[]", "name": "_chargingStops", "type": "tuple[]"}
    ],
    "name": "planJourney",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_journeyId", "type": "uint256"}],
    "name": "getJourney",
    "outputs": [
      {"components": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "user", "type": "address"},
        {"internalType": "string", "name": "origin", "type": "string"},
        {"internalType": "string", "name": "destination", "type": "string"},
        {"internalType": "uint256", "name": "vehicleId", "type": "uint256"},
        {"internalType": "uint256", "name": "userVehicleIndex", "type": "uint256"},
        {"internalType": "uint256", "name": "initialBatteryLevel", "type": "uint256"},
        {"internalType": "uint256", "name": "totalDistance", "type": "uint256"},
        {"internalType": "uint256", "name": "estimatedTotalTime", "type": "uint256"},
        {"internalType": "uint256", "name": "departureTime", "type": "uint256"},
        {"internalType": "uint256", "name": "estimatedArrivalTime", "type": "uint256"},
        {"internalType": "uint256[]", "name": "chargingStationIds", "type": "uint256[]"},
        {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
        {"internalType": "enum JourneyPlanner.JourneyStatus", "name": "status", "type": "uint8"}
      ], "internalType": "struct JourneyPlanner.Journey", "name": "", "type": "tuple"},
      {"components": [
        {"internalType": "uint256", "name": "stationId", "type": "uint256"},
        {"internalType": "uint256", "name": "estimatedArrivalTime", "type": "uint256"},
        {"internalType": "uint256", "name": "estimatedDepartureTime", "type": "uint256"},
        {"internalType": "uint256", "name": "chargingDuration", "type": "uint256"},
        {"internalType": "uint256", "name": "expectedChargeAmount", "type": "uint256"},
        {"internalType": "bool", "name": "isCompleted", "type": "bool"}
      ], "internalType": "struct JourneyPlanner.ChargingStop[]", "name": "", "type": "tuple[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserJourneys",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const BOOKING_MANAGER_ABI = [
  // Your BookingManager ABI from the JSON file
  {
    "inputs": [
      {"internalType": "uint256", "name": "_stationId", "type": "uint256"},
      {"internalType": "uint256", "name": "_slotNumber", "type": "uint256"},
      {"internalType": "uint256", "name": "_journeyId", "type": "uint256"},
      {"internalType": "uint256", "name": "_scheduledStartTime", "type": "uint256"},
      {"internalType": "uint256", "name": "_estimatedChargingDuration", "type": "uint256"}
    ],
    "name": "createBooking",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_bookingId", "type": "uint256"}],
    "name": "getBooking",
    "outputs": [
      {"components": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "user", "type": "address"},
        {"internalType": "uint256", "name": "stationId", "type": "uint256"},
        {"internalType": "uint256", "name": "slotNumber", "type": "uint256"},
        {"internalType": "uint256", "name": "journeyId", "type": "uint256"},
        {"internalType": "uint256", "name": "scheduledStartTime", "type": "uint256"},
        {"internalType": "uint256", "name": "scheduledEndTime", "type": "uint256"},
        {"internalType": "uint256", "name": "estimatedChargingDuration", "type": "uint256"},
        {"internalType": "uint256", "name": "bookedAt", "type": "uint256"},
        {"internalType": "enum BookingManager.BookingStatus", "name": "status", "type": "uint8"},
        {"internalType": "uint256", "name": "actualStartTime", "type": "uint256"},
        {"internalType": "uint256", "name": "actualEndTime", "type": "uint256"},
        {"internalType": "uint256", "name": "totalCost", "type": "uint256"},
        {"internalType": "bool", "name": "isPaid", "type": "bool"}
      ], "internalType": "struct BookingManager.Booking", "name": "", "type": "tuple"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract addresses (replace with your deployed contract addresses)
const CONTRACT_ADDRESSES = {
  JOURNEY_PLANNER: "0x8F2ec925d70fA44d4C633Df2C1E8C368d3A270F2",
  BOOKING_MANAGER: "0xB6d81503a0cF4C83f8590060E66e013B613fdE38",
  VEHICLE_REGISTRY: "0x3E51C8DCD22Dba7118f53FA2eC12e3B593A1e66f",
  CHARGING_STATION_MANAGER: "0x6913b4e587FceA0Fa01C87C6E3984aDeB72Ea82b"
};

// Web3 Hook for contract interactions
const useWeb3 = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState('');
  const [contracts, setContracts] = useState<{
    journeyPlanner?: ethers.Contract;
    bookingManager?: ethers.Contract;
  }>({});

  useEffect(() => {
    const initWeb3 = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await web3Provider.send("eth_requestAccounts", []);
          const signer = await web3Provider.getSigner();
          
          setProvider(web3Provider);
          setSigner(signer);
          setAccount(accounts[0]);

          // Initialize contracts
          const journeyPlannerContract = new ethers.Contract(
            CONTRACT_ADDRESSES.JOURNEY_PLANNER,
            JOURNEY_PLANNER_ABI,
            signer
          );

          const bookingManagerContract = new ethers.Contract(
            CONTRACT_ADDRESSES.BOOKING_MANAGER,
            BOOKING_MANAGER_ABI,
            signer
          );

          setContracts({
            journeyPlanner: journeyPlannerContract,
            bookingManager: bookingManagerContract
          });
        } catch (error) {
          console.error("Web3 initialization error:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initWeb3();
  }, []);

  return { provider, signer, account, contracts };
};

export default function JourneyPlanner() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [journeyPlanned, setJourneyPlanned] = useState(false);
  const [departureTime, setDepartureTime] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [loading, setLoading] = useState(false);
  type JourneyData = {
    id: number;
    [key: string]: any; // Add other properties as needed
  };
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  type ChargingStop = {
    stationId: number;
    estimatedArrivalTime: number;
    estimatedDepartureTime: number;
    chargingDuration: number;
    expectedChargeAmount: number;
    isCompleted: boolean;
  };
  const [chargingStops, setChargingStops] = useState<ChargingStop[]>([]);

  const { provider, signer, account, contracts } = useWeb3();

  // Mock data for charging stations (you can replace this with actual contract calls)
  const mockChargingStations = [
    {
      id: 1,
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
      id: 2,
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

  const handlePlanJourney = async () => {
    // Validate inputs
    if (!origin || !destination || !selectedVehicle || !departureTime || !departureDate) {
      alert('Please fill in all the required fields');
      return;
    }

    if (!contracts.journeyPlanner) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    
    try {
      // Convert departure date and time to timestamp
      const departureDateTime = new Date(`${departureDate}T${departureTime}`);
      const departureTimestamp = Math.floor(departureDateTime.getTime() / 1000);

      // Mock data for journey planning (replace with actual calculations)
      const totalDistance = 500; // km
      const estimatedTotalTime = 27000; // seconds (7.5 hours)
      const userVehicleIndex = parseInt(selectedVehicle) || 0;
      
      // Prepare charging stops data
      const chargingStopsData = mockChargingStations.map((station, index) => ({
        stationId: station.id,
        estimatedArrivalTime: departureTimestamp + (index + 1) * 14400, // 4 hours apart
        estimatedDepartureTime: departureTimestamp + (index + 1) * 14400 + station.chargingTime * 60,
        chargingDuration: station.chargingTime * 60, // convert to seconds
        expectedChargeAmount: 50, // kWh
        isCompleted: false
      }));

      const chargingStationIds = mockChargingStations.map(station => station.id);

      // Call the smart contract to plan journey
      const tx = await contracts.journeyPlanner.planJourney(
        origin,
        destination,
        userVehicleIndex,
        totalDistance,
        estimatedTotalTime,
        departureTimestamp,
        chargingStationIds,
        chargingStopsData
      );

      await tx.wait();
      
      // Get the journey ID (assuming it's incremental)
      const currentJourneyId = await contracts.journeyPlanner.getCurrentJourneyId();
      
      // Fetch the created journey data
      const [journey, stops] = await contracts.journeyPlanner.getJourney(currentJourneyId);
      
      setJourneyData(journey);
      setChargingStops(stops);
      setJourneyPlanned(true);
      
    } catch (error) {
      console.error("Error planning journey:", error);
      alert("Failed to plan journey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookChargingSlots = async () => {
    if (!contracts.bookingManager || !journeyData) {
      alert('Please connect your wallet and plan a journey first');
      return;
    }

    setLoading(true);
    
    try {
      // Create bookings for each charging stop
      for (let i = 0; i < chargingStops.length; i++) {
        const stop = chargingStops[i];
        
        const tx = await contracts.bookingManager.createBooking(
          stop.stationId,
          1, // slot number (you might want to make this dynamic)
          journeyData.id,
          stop.estimatedArrivalTime,
          stop.chargingDuration
        );
        
        await tx.wait();
      }
      
      alert('All charging slots booked successfully!');
      
    } catch (error) {
      console.error("Error booking charging slots:", error);
      alert("Failed to book charging slots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetJourney = () => {
    setJourneyPlanned(false);
    setJourneyData(null);
    setChargingStops([]);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Journey Planner</h1>
          <div className="text-sm text-gray-600">
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
          </div>
        </div>
        
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
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                  >
                    <option value="">Select Vehicle</option>
                    <option value="0">Tesla Model 3</option>
                    <option value="1">Nissan Leaf</option>
                    <option value="2">BMW i3</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Battery Level</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={batteryLevel}
                      onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-1">
                      <Battery className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">{batteryLevel}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handlePlanJourney}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {loading ? 'Planning Journey...' : 'Plan Journey'}
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
                  {journeyData && (
                    <p className="text-sm text-green-600 mt-1">
                      Journey ID: {journeyData.id.toString()}
                    </p>
                  )}
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
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-gray-500">Map Integration Coming Soon</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Journey Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium">500 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Time:</span>
                        <span className="font-medium">7h 30m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Charging Stops:</span>
                        <span className="font-medium">{chargingStops.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Battery Usage:</span>
                        <span className="font-medium">85%</span>
                      </div>
                    </div>
                  </div>
                  
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
                {mockChargingStations.map((station, index) => {
                  const contractStop = chargingStops[index];
                  return (
                    <div key={station.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{station.name}</h4>
                          <p className="text-sm text-gray-600">{station.location}</p>
                          <div className="mt-2 flex space-x-4 text-sm">
                            <span className="text-gray-600">
                              Arrival: {contractStop ? formatTimestamp(contractStop.estimatedArrivalTime) : station.arrivalTime}
                            </span>
                            <span className="text-gray-600">
                              Departure: {contractStop ? formatTimestamp(contractStop.estimatedDepartureTime) : station.departureTime}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Available Slots</div>
                          <div className="text-lg font-semibold text-green-600">{station.availability}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleBookChargingSlots}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-8 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                {loading ? 'Booking Slots...' : 'Confirm & Book Charging Slots'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}