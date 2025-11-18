export type GeoPoint = { lat: number; lng: number; accuracy?: number };

export async function getCurrentLocationWithGoodAccuracy(
  maxAccuracy: number = 2000, // in meters
): Promise<GeoPoint | undefined> {
  if (typeof window === "undefined" || !("geolocation" in navigator))
    return undefined;

  return new Promise((resolve) => {
    const tryGetLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;

          // Check accuracy
          if (accuracy && accuracy <= maxAccuracy) {
            resolve({
              lat: latitude,
              lng: longitude,
              accuracy,
            });
          } else {
            setTimeout(tryGetLocation, 1000);
          }
        },
        () => resolve(undefined),
        { enableHighAccuracy: true, timeout: 15000 },
      );
    };

    tryGetLocation();
  });
}
