import { getStationsData } from "@/shared/services/stationService";
import FuelStationsList from "@/shared/components/FuelStationsList";

export const dynamic = "force-dynamic"; // Ensure fresh data on every request

export default async function Home() {
  const data = await getStationsData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl font-semibold text-red-500">
          Error loading station data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <FuelStationsList
      initialStations={data.stations}
      lastUpdated={data.updateDate}
    />
  );
}
