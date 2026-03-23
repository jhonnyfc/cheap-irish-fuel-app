import React from "react";
import { getStationsData } from "@/shared/services/stationService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Station } from "@/shared/models/Station";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/shared/components/Footer";
import EditFuelForm from "@/shared/components/EditFuelForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ gasId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { gasId } = await params;
  return {
    title: `Edit Station ${gasId} - Cheap Irish Fuel`,
  };
}

export default async function EditFuelStationPage({ params }: PageProps) {
  const { gasId } = await params;
  const data = await getStationsData();

  if (!data) {
    return notFound();
  }

  const station = data.stations.find((s: Station) => s.gasId === gasId);
  if (!station) {
    return notFound();
  }

  const locationName = station.countyName
    ? `${station.countyName}`
    : `Lat: ${station.latitude.toFixed(2)}, Lng: ${station.longitude.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-sans">
      <div className="bg-white dark:bg-zinc-900 shadow-sm p-4 sticky top-0 z-10 flex items-center border-b dark:border-zinc-800">
        <Link
          href={`/station/${station.gasId}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold flex items-center gap-2"
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
          Back to station
        </Link>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 flex flex-col gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden flex justify-between items-start gap-4">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-zinc-100 mb-1">
              {station.stationName}
            </h1>
            <p className="text-gray-500 dark:text-zinc-400 font-medium text-sm md:text-base uppercase tracking-wider">
              {locationName}
            </p>
          </div>
        </div>

        <EditFuelForm station={station} />
      </div>

      <Footer />
      <Analytics />
    </div>
  );
}
