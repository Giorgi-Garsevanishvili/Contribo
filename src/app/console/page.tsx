"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./loading";

export default function ConsolePage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/console/regions");
      setData(res.data);
    } catch (error) {
      console.error("failed to fetch", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteRegion = async (id: string) => {
    try {
      await axios.delete(`/api/console/regions/${id}`);
      alert(`Region with ID: ${id} successfully deleted`);
      fetchData(); // ⬅️ re-fetch from server
    } catch (error) {
      console.error("Failed to delete region:", error);
    }
  };

  if (isLoading) return <Loading />;
  if (!data || data.length === 0) return <p>No regions found</p>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Regions</h1>
      <ul className="space-y-2">
        {data.map((region) => (
          <li key={region.id} className="border p-2 rounded-md">
            <p>
              <strong>Name:</strong> {region.name}
            </p>
            {region.logo && (
              <img
                src={region.logo}
                alt={region.name}
                className="h-10 w-auto mt-2"
              />
            )}
            <p>
              <strong>Email:</strong> {region.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {region.phone || "N/A"}
            </p>

            <button
              onClick={() => deleteRegion(region.id)}
              className="font-bold text-sm text-white bg-red-600 rounded-2xl p-2 m-2"
            >
              Delete Region
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
