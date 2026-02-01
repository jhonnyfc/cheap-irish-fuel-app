export interface Station {
  stationName: string;
  latitude: number;
  longitude: number;
  countyName?: string | null;
  distance?: number | null;
  dieselPrice: number | null;
  unleadedPrice: number | null;
  dateUpdated?: string | null;
}
