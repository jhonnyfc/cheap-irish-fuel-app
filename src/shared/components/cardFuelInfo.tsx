"use client";

import React from "react";
import ShareButton from "@/shared/components/ShareButton";

interface FuelPrice {
  type: string;
  price: number | string;
}

interface FuelStationCardProps {
  gasId: string;
  name: string;
  city: string;
  distance: number | string;
  mapsLink: string;
  fuelPrices: FuelPrice[];
  updatedDate?: string | null;
}

const FuelStationCard: React.FC<FuelStationCardProps> = ({
  gasId,
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
      ? Math.round(
          ((new Date().getTime() - new Date(updatedDate).getTime()) /
            (1000 * 60 * 60 * 24)) *
            100,
        ) / 100
      : -1;

  const getTextColor = () => {
    const daysAgo = getDaysAgo();

    if (daysAgo < 0 || daysAgo > 6) {
      return "text-red-500";
    }

    if (daysAgo <= 2) return "text-green-500";
    if (daysAgo <= 6) return "text-orange-500";
  };

  const getFuelColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "unleaded":
        return "bg-green-600";
      case "diesel":
        return "bg-black";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="max-w-[355px] p-4 bg-white border rounded-lg shadow-md relative">
      <div className="mb-2 flex justify-between items-start gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600">{city}</p>
        </div>
        <ShareButton
          title={`Check out ${name} - Found on Cheap Irish Fuel!!`}
          text={`Fuel prices at ${name} in ${city} - Found on Cheap Irish Fuel!!`}
          url={`${process.env.NEXT_PUBLIC_BASE_URL}/station/${gasId}`}
        />
      </div>

      <div className="mb-4 text-sm text-gray-500">
        <p>Distance: {distance} km Aprox.</p>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700">Fuel Prices:</h3>
        <ul className="pl-4 list-disc flex flex-col gap-1">
          {fuelPrices.map((fuel, index) => (
            <li
              key={index}
              className={`w-fit rounded-[10px] px-[10px] ${getFuelColor(
                fuel.type,
              )} text-white font-bold`}
            >
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

      <p className={`mt-4 text-sm ${getTextColor()} font-semibold`}>
        Last updated: {formattedDate}
      </p>
    </div>
  );
};

export default FuelStationCard;
