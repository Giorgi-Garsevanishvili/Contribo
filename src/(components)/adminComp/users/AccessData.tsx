"use client";
import { useCompAlert } from "@/hooks/useCompAlert";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

type Data = {
  createdAt: string | null;
  createdBy: { name: string }| null;
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

function AccessData({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data>();
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/allowedUsers/${id}`);

      setData(response.data.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      triggerCompAlertRef.current({
        message: `${error}`,
        type: "error",
        isOpened: true,
      });
    }
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      {
        <div className="flex flex-col justify-center items-center">
          {" "}
          <div
            className={`${isLoading ? "animate-pulse transition-all duration-300" : ""} select-none flex p-1 items-center justify-center bg-gray-200/60 rounded-lg shadow-lg`}
          >
            <div className="flex flex-col bg-gray-200/60 p-3 rounded-lg">
              <h3 className="font-bold">Access Details</h3>
              <div className="flex flex-col mt-1 text-xs">
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
