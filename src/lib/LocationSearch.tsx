"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader } from "lucide-react";
import * as Nominatim from "nominatim-browser";

interface NominatimResult {
  osm_id: number;
  display_name: string;
  lat: string;
  lon: string;
  importance?: number;
  type?: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
}

const DEBOUNCE_DELAY = 1500;

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useManualInput, setUseManualInput] = useState<boolean>(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (text: string): Promise<void> => {
    if (!text || text.length < 3) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    setLoading(true);
    setIsOpen(true);
    setError(null);
    try {
      const data: NominatimResult[] = await Nominatim.geocode({
        q: text,
        limit: 4,
        addressdetails: true,
        
      });
      if (data.length === 0) {
        setError("No locations found. You can enter it manually below.");
        setResults([] as NominatimResult[]);
      } else {
        setResults(data as NominatimResult[]);
        setError(null);
      }
    } catch (error) {
      console.error("Location search failed:", error);
      setResults([]);
      setError("Unable to search locations. You can enter it manually below.");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLocation = useCallback(
    (text: string): void => {
      // Clear previous debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new debounce timer
      debounceTimer.current = setTimeout(() => {
        performSearch(text);
      }, DEBOUNCE_DELAY);
    },
    [performSearch],
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSelect = (result: NominatimResult): void => {
    onLocationSelect(result.display_name);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setError(null);
    setUseManualInput(false);
  };

  const handleManualSubmit = (): void => {
    if (query.trim()) {
      onLocationSelect(query.trim());
      setQuery("");
      setError(null);
      setUseManualInput(false);
    }
  };

  const handleInputChange = (value: string): void => {
    setQuery(value);
    if (value.length >= 3) {
      searchLocation(value);
    } else {
      setResults([]);
      setError(null);
    }
  };

  const handleBlur = (): void => {
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="space-y-2 w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search location (e.g., Riga, Latvia)"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= 3 && setIsOpen(true)}
          onBlur={handleBlur}
          className="w-full px-4 py-2  bg-gray-800  rounded-xs ring-1 ring-gray-700 focus:outline-none focus:ring-2"
        />

        {loading && (
          <Loader
            className="absolute right-3 top-2.5 animate-spin text-gray-400"
            size={20}
          />
        )}

        {isOpen && results.length > 0 && (
          <div className="absolute top-full overflow-scroll left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            {results.map((result) => (
              <button
                key={result.osm_id}
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  {result.display_name.split(",")[0]}
                </div>
                <div className="text-sm text-gray-600">
                  {result.display_name.split(",").slice(1).join(",")}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
          <AlertCircle className="text-yellow-600 flex shrink-0" size={18} />
          <div className="flex-1">
            <p className="text-sm text-yellow-800">{error}</p>
            {!useManualInput && (
              <button
                type="button"
                onClick={() => setUseManualInput(true)}
                className="text-sm font-medium text-yellow-700 hover:text-yellow-900 mt-1 underline"
              >
                Enter location manually
              </button>
            )}
          </div>
        </div>
      )}

      {useManualInput && (
        <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">
            Enter location manually
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Riga, Latvia"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="button"
              onClick={handleManualSubmit}
              disabled={!query.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationSearch;
