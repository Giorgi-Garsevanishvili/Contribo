"use client";

import { useCallback, useState, type FormEvent } from "react";
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

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useManualInput, setUseManualInput] = useState(false);

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
        limit: 5,
        addressdetails: true,
      });

      if (data.length === 0) {
        setError("No locations found. You can enter it manually below.");
        setResults([]);
      } else {
        setResults(data);
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

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (loading || query.trim().length < 3) {
      return;
    }

    void performSearch(query.trim());
  };

  const handleInputChange = (value: string): void => {
    setQuery(value);
    setResults([]);
    setIsOpen(false);
    setError(null);
  };

  const handleSelect = (result: NominatimResult): void => {
    onLocationSelect(result.display_name);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setError(null);
    setUseManualInput(false);
  };

  const handleManualSubmit = (): void => {
    const location = query.trim();

    if (location) {
      onLocationSelect(location);
      setQuery("");
      setResults([]);
      setIsOpen(false);
      setError(null);
      setUseManualInput(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <form
        className="space-y-2"
        onSubmit={handleSearchSubmit}
        onBlur={(event) => {
          const nextFocusedElement = event.relatedTarget;

          if (
            nextFocusedElement instanceof Node &&
            event.currentTarget.contains(nextFocusedElement)
          ) {
            return;
          }

          setIsOpen(false);
        }}
      >
        <div className="relative">
          <label htmlFor="location-search" className="sr-only">
            Search location
          </label>
          <input
            id="location-search"
            type="text"
            placeholder="Search location (e.g., Riga, Latvia)"
            value={query}
            onChange={(event) => handleInputChange(event.target.value)}
            autoComplete="off"
            className="w-full px-4 py-2 bg-gray-800 rounded-xs ring-1 ring-gray-700 focus:outline-none focus:ring-2"
          />

          {loading && (
            <Loader
              aria-hidden="true"
              className="absolute right-3 top-2.5 animate-spin text-gray-400"
              size={20}
            />
          )}

          {isOpen && results.length > 0 && (
            <div className="absolute top-full overflow-auto no-scrollbar left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              {results.map((result) => (
                <button
                  key={result.osm_id}
                  type="button"
                  onClick={() => handleSelect(result)}
                  className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors"
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

        <button
          type="submit"
          disabled={loading || query.trim().length < 3}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

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
          <label
            htmlFor="manual-location"
            className="block text-sm font-medium text-gray-700"
          >
            Enter location manually
          </label>
          <div className="flex gap-2">
            <input
              id="manual-location"
              type="text"
              placeholder="e.g., Riga, Latvia"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
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

      <p className="text-xs text-gray-500">
        Search data ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          OpenStreetMap contributors
        </a>
      </p>
    </div>
  );
}

export default LocationSearch;
