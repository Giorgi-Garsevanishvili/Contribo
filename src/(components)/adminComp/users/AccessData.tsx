"use client";

import { useFetchData } from "@/hooks/useDataFetch";


type Data = {
  createdAt: string | null;
  createdBy: { name: string } | null;
  email: string | null;
  region: {
    name: string;
    status: string;
  };
  roles: { role: { name: string } }[];
  updatedAt: string;
  user: {
    name: string;
  };
  updatedBy: {
    name: string;
  } | null;
};

function AccessData({ id, refetchKey }: { id: string; refetchKey: boolean }) {
  const { data, isLoadingFetch } = useFetchData<Data>(
    `/api/admin/allowedUsers/${id}`,
    [refetchKey],
  );

  return (
    <div className="flex justify-center items-center">
      {
        <div className="flex flex-col justify-center items-center">
          {" "}
          <div
            className={`${isLoadingFetch ? "animate-pulse transition-all duration-300" : ""} select-none flex p-1 items-center justify-center bg-gray-200/60 rounded-lg shadow-lg`}
          >
            <div className="flex flex-col bg-gray-200/60 p-1.5 rounded-lg">
              <h3 className="font-bold">Access Details</h3>
              <div className="flex flex-col mt-1 text-sm">
                <h2>
                  <strong>User:</strong> {data?.user.name}
                </h2>
                <h2>
                  <strong>Access Email:</strong> {data?.email}
                </h2>
                <h2>
                  <strong>Roles:</strong>{" "}
                  {data?.roles.map((role) => role.role.name).join(", ")}
                </h2>
                <h2>
                  <strong>Region:</strong> {data?.region.name}
                </h2>
                <h2>
                  <strong>Region Status:</strong> {data?.region.status}
                </h2>
                <h2>
                  <strong>Access Granted At:</strong>{" "}
                  {data?.createdAt
                    ? new Date(data?.createdAt).toLocaleString()
                    : "No Data"}
                </h2>
                <h2>
                  <strong>Access Granted By:</strong>{" "}
                  {data?.createdBy?.name || "No Data"}
                </h2>
                <h2>
                  <strong>Access Updated At:</strong>{" "}
                  {data?.updatedAt
                    ? new Date(data?.updatedAt).toLocaleString()
                    : "Data Not Found"}
                </h2>
                <h2>
                  <strong>Access Updated By:</strong>{" "}
                  {data?.updatedBy?.name || "No Data"}
                </h2>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
export default AccessData;
