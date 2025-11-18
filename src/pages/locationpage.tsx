/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { RefreshCw, MapPin, Loader, XCircle, Globe } from "lucide-react";

// Types
type LocationData = {
  lat: number;
  lng: number;
  accuracy: number;
  landmark: string;
};

// --- Reverse Geocoding Function (Unchanged) ---
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

// --- Main Component ---
export default function LocationPage() {
  const [data, setData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start loading immediately

  // Store the watch ID to clear it later
  const [watchId, setWatchId] = useState<number | null>(null);

  // Function to start/restart watching the position
  const startWatchingPosition = () => {
    // Clear any existing watch
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }

    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setData(null);
    setError(null);

    const newWatchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        // Only fetch landmark on first successful watch or if location changes significantly
        // For simplicity, we fetch it every time here, but in a real app, you might debounce this.
        const landmark = await getLandmark(latitude, longitude);

        setData({
          lat: latitude,
          lng: longitude,
          accuracy,
          landmark,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      },
    );

    setWatchId(newWatchId);
  };

  // Initial effect to start watching
  useEffect(() => {
    startWatchingPosition();

    // Cleanup function: stop watching when the component unmounts
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []); // Empty dependency array means this runs only once on mount

  // Alias the start function for the button click
  const refreshLocation = () => {
    startWatchingPosition();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="flex items-center text-3xl font-extrabold text-gray-900">
            <MapPin className="w-7 h-7 mr-3 text-indigo-600" />
            Live Location Tracker
          </h1>
          <button
            onClick={refreshLocation}
            disabled={loading}
            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-300 ease-in-out ${
              loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Updating…
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </button>
        </div>

        {/* --- Error Display --- */}
        {error && (
          <div className="flex items-center mt-4 p-4 bg-red-50 border border-red-300 rounded-lg shadow-sm">
            <XCircle className="w-6 h-6 mr-3 text-red-600" />
            <p className="text-red-700 font-medium">
              **Geolocation Error:** {error}
            </p>
          </div>
        )}

        {/* --- Loading Display --- */}
        {!data && !error && (
          <div className="flex flex-col items-center justify-center p-12 bg-indigo-50 rounded-lg shadow-inner">
            <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="mt-4 text-lg font-medium text-indigo-700">
              Pinpointing your location...
            </p>
            <p className="text-sm text-indigo-500">
              (Please allow location access in your browser)
            </p>
          </div>
        )}

        {/* --- Data Display --- */}
        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Latitude Card */}
              <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-lg transition transform hover:scale-[1.02]">
                <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
                  Latitude
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {data.lat.toFixed(6)}
                </p>
              </div>

              {/* Longitude Card */}
              <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-lg transition transform hover:scale-[1.02]">
                <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
                  Longitude
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {data.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-500 font-medium flex items-center">
                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                GPS Accuracy
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {data.accuracy.toFixed(2)} meters
              </p>
            </div>

            {/* Landmark Section */}
            <div className="pt-4 border-t">
              <h3 className="flex items-center text-xl font-bold text-indigo-700">
                <MapPin className="w-5 h-5 mr-2" />
                Nearest Landmark (Reverse Geocoded)
              </h3>
              <p className="mt-2 p-3 bg-indigo-50 border-l-4 border-indigo-500 text-gray-800 rounded-r-lg font-medium">
                {data.landmark}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
