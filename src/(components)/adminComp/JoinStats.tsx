"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCompAlert } from "@/hooks/useCompAlert";
import { HiHandRaised } from "react-icons/hi2";
import { useRouter } from "next/navigation";

type Data = {
  id: string;
  region: { name: string };
  status: string;
};

function JoinStats() {
  const [data, setData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/joinRequests");
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

  const requestLength = data.filter(
    (s) => s.status !== "APPROVED" && s.status !== "REJECTED"
  ).length;

  return (
    <>
      <button
        onClick={() => router.push("admin/users")}
        className={`${
          isLoading ? "animate-pulse" : ""
        } flex hover:shadow-lg hover:opacity-80 duration-300 btn flex-col select-none w-[10rem] h-[10rem] items-center justify-center mt-0 m-2 text-white pt-0 p-0.5 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        <HiHandRaised size={30} className="m-2" />
        <h1
          className={`text-2xl ${
            isLoading ? "animate-spin" : ""
          } font-bold m-1`}
        >
          {isLoading ? "." : requestLength}
        </h1>
        <h3>New Join Requests</h3>
      </button>
    </>
  );
}

export default JoinStats;
