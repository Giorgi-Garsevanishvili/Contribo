"use client";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Loading from "./loading";

export default function ConsolePage() {
  const [data, setData] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoadingRegion, setIsLoadingRegion] = useState(true);
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [allowedData, setAllowedData] = useState({ email: "" });

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/console/regions");
      setData(res.data);
    } catch (error) {
      console.error("failed to fetch", error);
    } finally {
      setIsLoadingRegion(false);
    }
  };

  const fetchDataRoles = async () => {
    try {
      const res = await axios.get("/api/console/roles");
      setRoles(res.data);
    } catch (error) {
      console.error("failed to fetch", error);
    } finally {
      setIsLoadingRole(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataRoles();
  }, []);

  const AddAllowedUser = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await axios.post("/api/console/allowed-users", allowedData);
      setAllowedData({ email: "" });
      alert("Allowed User Created");
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const deleteRegion = async (id: string) => {
    try {
      await axios.delete(`/api/console/regions/${id}`);
      alert(`Region with ID: ${id} successfully deleted`);
      fetchData(); // ⬅️ re-fetch from server
    } catch (error) {
      console.error("Failed to delete region:", error);
      return;
    }
  };

  const deleteRole = async (id: string) => {
    try {
      setIsLoadingRole(true);
      await axios.delete(`/api/console/roles/${id}`);
      //alert(`Role with ID: ${id} successfully deleted`);
      fetchDataRoles(); // ⬅️ re-fetch from server
      setIsLoadingRole(false);
    } catch (error) {
      setIsLoadingRole(false);
      console.error("Failed to delete region:", error);
      return;
    }
  };

  if (isLoadingRegion) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center w-lg">
      <main className="flex justify-between w-lg">
        <div className="flex flex-col p-3 min-w-80">
          <h1 className="text-2xl font-semibold mb-4">Regions</h1>
          {isLoadingRegion ? (
            <Loading />
          ) : (
            <>
              {!data || data.length === 0 ? (
                <p>No regions found</p>
              ) : (
                <ul className="space-y-2 flex flex-col bg-white border-amber-200 border-2 rounded-2xl p-3 h-90 overflow-scroll">
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
              )}
            </>
          )}
        </div>
        <div className="flex flex-col p-3 min-w-80">
          <h1 className="text-2xl font-semibold mb-4">Roles</h1>
          <ul className="space-y-2 flex flex-col bg-white border-amber-200 border-2 rounded-2xl p-3 h-90 overflow-scroll">
            {isLoadingRole ? (
              <Loading />
            ) : (
              <>
                {!roles || roles.length === 0 ? (
                  <p>No Roles Found</p>
                ) : (
                  <>
                    {roles.map((roles) => (
                      <li key={roles.id} className="border p-2 rounded-md">
                        <p>
                          <strong>Name:</strong> {roles.name}
                        </p>

                        <button
                          onClick={() => deleteRole(roles.id)}
                          className="font-bold text-sm text-white bg-red-600 rounded-2xl p-2 m-2"
                        >
                          Delete Roles
                        </button>
                      </li>
                    ))}
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </main>
      <div className="flex flex-row bg-white w-lg items-center justify-center p-2 border-amber-200 border-1 ">
        <form
          onSubmit={(e) => AddAllowedUser(e)}
          className="flex justify-between w-sm items-center"
        >
          <input
            type="email"
            placeholder="Enter Allowed User Email"
            className="flex border-amber-200 border-1 p-3 bg-white rounded-2xl"
            onChange={(e) => setAllowedData({ email: e.target.value })}
            name="email"
            value={allowedData.email}
          />
          <button
            type="submit"
            className="flex p-2 bg-amber-500 text-white rounded-2xl btn"
          >
            Add Allowed User
          </button>
        </form>
      </div>
    </div>
  );
}
