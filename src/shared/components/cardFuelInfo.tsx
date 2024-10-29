"use client"; // This marks the component as a Client Component

import React from "react";

interface FuelPrice {
  type: string;
  price: number | string;
}

interface FuelStationCardProps {
  name: string;
  city: string;
  distance: number | string;
  mapsLink: string;
  fuelPrices: FuelPrice[];
  updatedDate?: string | null;
}

const FuelStationCard: React.FC<FuelStationCardProps> = ({
  name,
  city,
  distance,
  mapsLink,
  fuelPrices,
  updatedDate,
}) => {
  const formattedDate = updatedDate
    ? new Date(updatedDate).toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "---";

  const getDaysAgo = () =>
    updatedDate
      ? Math.floor(
          (new Date().getTime() - new Date(updatedDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : -1;

  const getTextColor = () => {
    const daysAgo = getDaysAgo();

    if (daysAgo < 0 || daysAgo > 3) {
      return "text-gray-500";
    }

    if (daysAgo <= 2) return "text-green-500";
    if (daysAgo <= 4) return "text-orange-500";
  };

  return (
    <div className="max-w-[355px] p-4 bg-white border rounded-lg shadow-md">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-gray-600">{city}</p>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        <p>Distance: {distance} km Aprox.</p>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700">Fuel Prices:</h3>
        <ul className="pl-4 list-disc">
          {fuelPrices.map((fuel, index) => (
            <li key={index} className="text-gray-600">
              {fuel.type}: {fuel.price}€ per liter
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

      <p className={`mt-4 text-sm ${getTextColor()}`}>
        Last updated: {formattedDate}
      </p>
    </div>
  );
};

export default FuelStationCard;
