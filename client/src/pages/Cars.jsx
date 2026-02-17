import React from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported
import swiftImage from '../assets/swift.jpg';
import wagonRImage from '../assets/wagon.jpg';
import balenoImage from '../assets/baleno.jpg';
import zestImage from '../assets/zest.jpg';
import nexonImage from '../assets/nexon.jpg';
import harrierImage from '../assets/harrier.jpg';

export const carsData = [
  { id: 1, name: 'Maruti Suzuki Swift Desire', image: swiftImage, charges: 1000 },
  { id: 2, name: "Maruti Suzuki Wagon R", image: wagonRImage, charges: 1000 },
  { id: 3, name: "Maruti Suzuki Baleno", image: balenoImage, charges: 1000 },
  { id: 4, name: "Tata Zest", image: zestImage, charges: 1000 },
  { id: 5, name: "Tata Nexon", image: nexonImage, charges: 1000 },
  { id: 6, name: "Tata Harrier", image: harrierImage, charges: 1000 },
  { id: 7, name: "Tata Nexon", image: nexonImage, charges: 1000 },
];
const dummyData = carsData;

const Cars = ({ cars }) => {
  const carsToDisplay = cars || dummyData;

  const handleBookNow = (e, carId) => {
    // Prevent the Link click when clicking the button
    e.preventDefault();
    e.stopPropagation();
    console.log('Booking car:', carId);
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {carsToDisplay.map((car) => (
            <Link 
              to={`/car/${car.id}`} 
              key={car.id} 
              className="block group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-500/50"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-slate-900">
                <img
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  src={car.image}
                  alt={car.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Car+Image';
                  }}
                />
                {car.id <= 3 && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.122 17.645a7.185 7.185 0 0 1-2.656 2.495 7.06 7.06 0 0 1-3.52.853 6.617 6.617 0 0 1-3.306-.718 6.73 6.73 0 0 1-2.54-2.266c-2.672-4.57.287-8.846.887-9.668A4.448 4.448 0 0 0 8.07 6.31 4.49 4.49 0 0 0 7.997 4c1.284.965 6.43 3.258 5.525 10.631 1.496-1.136 2.7-3.046 2.846-6.216 1.43 1.061 3.985 5.462 1.754 9.23Z" />
                      </svg>
                      Popular
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-400 transition-colors">
                  {car.name}
                </h3>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-indigo-400">
                    ₹{car.charges.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-400">/day</span>
                </div>

                <button
                  onClick={(e) => handleBookNow(e, car.id)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-95"
                >
                  Book Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;