import { getStationsData } from "@/shared/services/stationService";
import FuelStationsList from "@/shared/components/FuelStationsList";

export const dynamic = "force-dynamic"; // Ensure fresh data on every request

export default async function Home() {
  const data = await getStationsData();

  if (!data) {
    return (
      <FuelStationsList
        initialStations={[]}
        lastUpdated={null}
        hasError={true}
      />
    );
  }

  return (
    <FuelStationsList
      initialStations={data.stations}
      lastUpdated={data.updateDate}
    />
  );
}
