export const getCurrentLocationName = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await response.json();

    return (
      data.display_name ||
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.city_district ||
      "Unknown Location"
    );
  } catch (error) {
    console.error("Error fetching location details:", error);
  }
};
