import React from "react";
import { getStationsData } from "@/shared/services/stationService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Station } from "@/shared/models/Station";
import ShareButton from "@/shared/components/ShareButton";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ gasId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { gasId } = await params;
  const data = await getStationsData();

  if (!data) return { title: "Station Not Found" };

  const station = data.stations.find((s: Station) => s.gasId === gasId);

  if (!station) return { title: "Station Not Found" };

  const locationName = station.countyName
    ? `${station.countyName}`
    : `Lat: ${station.latitude.toFixed(2)}, Lng: ${station.longitude.toFixed(2)}`;

  const uPrice = station.unleadedPrice
    ? `Unleaded: ${station.unleadedPrice}€/L`
    : "";
  const dPrice = station.dieselPrice ? `Diesel: ${station.dieselPrice}€/L` : "";
  const prices = [uPrice, dPrice].filter(Boolean).join(" | ");

  const title = `${station.stationName} - Fuel Prices | Found on Cheap Irish Fuel!!`;
  const description = `Check the latest fuel prices at ${station.stationName} in ${locationName}. ${
    prices ? `Current prices: ${prices}.` : ""
  } Find the cheapest diesel and unleaded fuel in Ireland!`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/station/${gasId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Cheap Irish Fuel",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function StationDetailsPage({ params }: PageProps) {
  const { gasId } = await params;
  const data = await getStationsData();

  if (!data) {
    return notFound();
  }

  const station = data.stations.find((s: Station) => s.gasId === gasId);
  if (!station) {
    return notFound();
  }

  const formattedDate = data.updateDate
    ? new Date(data.updateDate).toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "---";

  const getDaysAgo = () =>
    data.updateDate
      ? Math.round(
          ((new Date().getTime() - new Date(data.updateDate).getTime()) /
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

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    station.longitude - 0.01
  },${station.latitude - 0.01},${station.longitude + 0.01},${
    station.latitude + 0.01
  }&layer=mapnik&marker=${station.latitude},${station.longitude}`;

  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;

  const locationName = station.countyName
    ? `${station.countyName}`
    : `Lat: ${station.latitude.toFixed(2)}, Lng: ${station.longitude.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10 flex items-center">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to stations
        </Link>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex justify-between items-start gap-4">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
              {station.stationName}
            </h1>
            <p className="text-gray-500 font-medium text-sm md:text-base uppercase tracking-wider">
              {locationName}
            </p>
            {station.distance && (
              <p className="text-gray-400 text-sm mt-3">
                Distance: {station.distance} km Aprox.
              </p>
            )}
          </div>
          <ShareButton
            title={`Check out ${station.stationName} - Found on Cheap Irish Fuel!!`}
            text={`Fuel prices at ${station.stationName} in ${locationName}`}
          />
        </div>

        {/* Prices Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Current Fuel Prices
          </h3>
          <ul className="flex flex-col gap-3">
            {station.unleadedPrice && (
              <li
                className={`w-full md:w-fit rounded-xl px-5 py-4 ${getFuelColor(
                  "unleaded",
                )} text-white font-bold text-lg shadow-sm flex justify-between items-center gap-6`}
              >
                <span>Unleaded</span>
                <span>{station.unleadedPrice}€ / L</span>
              </li>
            )}
            {station.dieselPrice && (
              <li
                className={`w-full md:w-fit rounded-xl px-5 py-4 ${getFuelColor(
                  "diesel",
                )} text-white font-bold text-lg shadow-sm flex justify-between items-center gap-6`}
              >
                <span>Diesel</span>
                <span>{station.dieselPrice}€ / L</span>
              </li>
            )}
            {!station.unleadedPrice && !station.dieselPrice && (
              <li className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
                No prices available
              </li>
            )}
          </ul>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <p
              className={`text-sm ${getTextColor()} font-medium flex items-center gap-1`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Updated: {formattedDate}
            </p>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative group">
          <div
            className="w-full h-[300px] md:h-[400px] block relative bg-gray-100"
            title="Open in Google Maps"
          >
            {/* pointer-events-none lets the <a> tag handle the click instead of the map iframe */}
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              src={mapUrl}
              className="absolute inset-0 border-0"
            ></iframe>
          </div>
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
