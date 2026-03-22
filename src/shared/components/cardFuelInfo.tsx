"use client";

import ShareButton from "@/shared/components/ShareButton";
import FavoriteButton from "@/shared/components/FavoriteButton";
import { getTextColor } from "../utils/fuelInfoUtils";

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
  dateUpdated?: string | null;
}

const FuelStationCard: React.FC<FuelStationCardProps> = ({
  gasId,
  name,
  city,
  distance,
  mapsLink,
  fuelPrices,
  dateUpdated,
}) => {
  const formattedDate = dateUpdated
    ? new Date(dateUpdated).toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "---";

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

  const handleCardClick = () => {
    window.open(`/station/${gasId}`, "_blank");
  };

  return (
    <div
      className="max-w-[355px] p-4 bg-white border rounded-lg shadow-md relative cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleCardClick}
    >
      <div className="mb-2 flex justify-between items-start gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600">{city}</p>
        </div>
        <div className="flex items-center gap-1 z-10">
          <FavoriteButton gasId={gasId} />
          <ShareButton
            title={`Check out ${name} - Found on Cheap Irish Fuel!!`}
            text={`Fuel prices at ${name} in ${city} - Found on Cheap Irish Fuel!!`}
            url={`${process.env.NEXT_PUBLIC_BASE_URL}/station/${gasId}`}
          />
        </div>
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
        className="text-blue-500 hover:underline relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        View on Google Maps
      </a>

      <p
        className={`mt-4 text-sm ${getTextColor(dateUpdated as string)} font-semibold`}
      >
        Last updated: {formattedDate}
      </p>
    </div>
  );
};

export default FuelStationCard;
