/* eslint-disable @typescript-eslint/no-unused-vars */
export type GeoPoint = { lat: number; lng: number; accuracy?: number };

// Reverse Geocoding (OpenStreetMap)
async function getLandmark(lat: number, lng: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );

    const json = await res.json();
    return json.display_name || "No landmark found";
  } catch (e) {
    return "Error fetching landmark";
  }
}

export async function getCurrentLocationWithGoodAccuracy(): Promise<
  GeoPoint | undefined
> {
  if (typeof window === "undefined" || !("geolocation" in navigator))
    return undefined;

  return new Promise((resolve) => {
    const tryGetLocation = () => {
      navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;

          const landmark = await getLandmark(latitude, longitude);

          resolve({
            lat: latitude,
            lng: longitude,
            accuracy,
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          resolve(undefined);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        },
      );
    };

    tryGetLocation();
  });
}
