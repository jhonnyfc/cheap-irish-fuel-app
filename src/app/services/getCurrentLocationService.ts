import { Location } from "@/shared/models/Location";

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Unable to retrieve your location.");
          reject(error);
        }
      );
    } else {
      const error = "Geolocation is not supported by this browser.";
      alert(error);
      reject(error);
    }
  });
};
