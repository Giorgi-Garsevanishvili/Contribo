"use client";

import React, { useEffect, useState } from "react";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useDataFetch";

type Data = {
  id: string;
  name: string;
  region: { name: string };
  rating: number | null;
};

function EventStats() {
  const [rating, setRating] = useState(0);
  const router = useRouter();

  const { data, isLoadingFetch } = useFetchData<Data[]>(
    "/api/admin/events",
    [],
  );

  useEffect(() => {
    if (data) {
      calculateRating(data);
    }
  }, [data]);

  const calculateRating = (value: Data[]) => {
    const ratingData = value
      .map((r) => r.rating)
      .filter((r): r is number => r !== null);
    const AverageRating =
      ratingData.reduce((a, b) => a + b, 0) / (ratingData.length || 1);

    setRating(AverageRating);
  };

  return (
    <>
      <button
        onClick={() => router.push("admin/users")}
        className={`${isLoadingFetch ? "animate-pulse" : ""} flex hover:shadow-lg hover:opacity-80 duration-300 btn flex-col select-none w-[10rem] h-[10rem] items-center justify-center mt-0 m-2 mb-0 text-white p-0 pt-4 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        <BsFillCalendarEventFill size={30} className="m-2" />
        <div className="flex flex-row p-0 m-0 justify-center items-center grow">
          <h1
            className={`text-2xl ${
              isLoadingFetch ? "animate-spin" : ""
            } font-bold mr-3`}
          >
            {isLoadingFetch ? "." : data?.length}
          </h1>
          <h3>Events</h3>
        </div>
        <div className="flex bg-white items-center border-gray-300 justify-center w-[10rem] p-1.5 m-0 rounded-b-xl">
          <h3 className="text-black text-sm">
            {`Average Rating: ${rating}`} &#10024;
          </h3>
        </div>
      </button>
    </>
  );
}

export default EventStats;
