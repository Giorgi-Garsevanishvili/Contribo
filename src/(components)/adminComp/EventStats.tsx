"use client";

import { useEffect, useState } from "react";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useDataFetch";
import { ImSpinner9 } from "react-icons/im";

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
    "/api/admin/events?limit=1000",
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
    
      <button
        onClick={() => router.push("admin/events")}
      className={`${
        isLoadingFetch ? "animate-pulse" : ""
      } flex hover:shadow-sm ease-out  hover:opacity-95 transition-all backdrop-blur-xs duration-300 btn w-full h-full gap-4 md:flex-col select-none md:w-40 md:h-40 items-center justify-between  text-white   bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        <BsFillCalendarEventFill size={30} />
        <div className="flex flex-row gap-2 justify-center items-center grow">
          <h1
            className={`text-2xl ${
              isLoadingFetch ? "animate-spin" : ""
            } font-bold`}
          >
            {isLoadingFetch ? (
              <div
                className={`text-sm ${
                  isLoadingFetch
                    ? "animate-spin transition-all duration-300"
                    : ""
                } font-bold`}
              >
                <ImSpinner9 className="animate-spin" size={25} />
              </div>
            ) : data && data?.length > 1000 ? (
              `${data?.length} +`
            ) : (
              data?.length
            )}
          </h1>
          <h3>Events</h3>
        </div>
        <div className="flex bg-white items-center border-gray-300 justify-center w-fit px-4 py-1.5  rounded-sm">
          <h3 className="text-black text-xs shrink-0">
            {`Average Rating: ${rating}`} &#10024;
          </h3>
        </div>
      </button>
    
  );
}

export default EventStats;
