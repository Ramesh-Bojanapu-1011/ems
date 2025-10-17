export type GeoPoint = { lat: number; lng: number; accuracy?: number };

export async function getCurrentLocation(): Promise<GeoPoint | undefined> {
  if (typeof window === "undefined" || !("geolocation" in navigator))
    return undefined;

  return new Promise<GeoPoint | undefined>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      () => resolve(undefined),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  });
}
