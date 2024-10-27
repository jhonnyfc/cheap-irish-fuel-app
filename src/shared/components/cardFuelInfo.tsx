"use client"; // This marks the component as a Client Component

import React from "react";

interface FuelPrice {
  type: string;
  price: number;
}

interface FuelStationCardProps {
  name: string;
  city: string;
  distance: number;
  mapsLink: string;
  fuelPrices: FuelPrice[];
}

const FuelStationCard: React.FC<FuelStationCardProps> = ({
  name,
  city,
  distance,
  mapsLink,
  fuelPrices,
}) => {
  const handleFavorite = () => {
    alert(`${name} added to favorites!`);
  };

  return (
    <div className="max-w-md p-4 bg-white border rounded-lg shadow-md">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-gray-600">{city}</p>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        <p>Distance: {distance} km</p>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700">Fuel Prices:</h3>
        <ul className="pl-4 list-disc">
          {fuelPrices.map((fuel, index) => (
            <li key={index} className="text-gray-600">
              {fuel.type}: ${fuel.price} per liter
            </li>
          ))}
        </ul>
      </div>

      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View on Google Maps
      </a>

      <button
        onClick={handleFavorite}
        className="mt-4 w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add to Favorites
      </button>
    </div>
  );
};

export default FuelStationCard;
