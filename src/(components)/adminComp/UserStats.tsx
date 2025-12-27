"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCompAlert } from "@/hooks/useCompAlert";
import Loading from "@/app/admin/loading";
import { GiHeartInside } from "react-icons/gi";
import { useRouter } from "next/navigation";

type UserData = {
  id: string;
  name: string;
  email: string;
};

function UserStats() {
  const [data, setData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await axios.get("/api/admin/users");
      setData(data.data);

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
    <>
      <button
        onClick={() => router.push("admin/users")}
        className={`flex hover:shadow-lg hover:opacity-80 duration-300 btn flex-col select-none w-[10rem] h-[10rem] items-center justify-center mt-0 m-2 text-white pt-0 p-0.5 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        <GiHeartInside size={30} className="m-2" />
        <h1 className={`text-2xl ${isLoading ? 'animate-spin' : ""} font-bold m-1`}>{isLoading ? "." : data.length}</h1>
        <h3>Volunteer</h3>
      </button>
    </>
  );
}

export default UserStats;
