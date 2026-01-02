"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCompAlert } from "@/hooks/useCompAlert";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

type Data = {
  id: string;
  name: string;
  region: { name: string };
  rating: Number | null;
};

function EventStats() {
  const [data, setData] = useState<Data[]>([]);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/events");
      setData(response.data);
      calculateRating(response.data);

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

  const calculateRating = (value: Data[]) => {
    const ratingData = value
      .map((r) => r.rating)
      .filter((r): r is number => r !== null);
    const AverageRating =
      ratingData.reduce((a, b) => a + b, 0) / (ratingData.length || 1);

    setRating(AverageRating);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <button
        onClick={() => router.push("admin/users")}
        className={`flex hover:shadow-lg hover:opacity-80 duration-300 btn flex-col select-none w-[10rem] h-[10rem] items-center justify-center mt-0 m-2 mb-0 text-white p-0 pt-4 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        <BsFillCalendarEventFill size={30} className="m-2" />
        <div className="flex flex-row p-0 m-0 justify-center items-center flex-grow">
          <h1
            className={`text-2xl ${
              isLoading ? "animate-spin" : ""
            } font-bold mr-3`}
          >
            {isLoading ? "." : data.length}
          </h1>
          <h3>Event</h3>
        </div>
        <div className="flex bg-white items-center border-gray-300 justify-center w-[10rem] p-1.5 m-0 rounded-b-xl">
          <h3 className="text-black text-sm">{`Average Rating: ${rating} ⭐`}</h3>
        </div>
      </button>
    </>
  );
}

export default EventStats;
