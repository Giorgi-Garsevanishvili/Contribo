"use client";
import usePaginatedData from "@/hooks/usePaginatedData";
import EventCard from "./EventCard";
import { ImSpinner9 } from "react-icons/im";
import { useRouter } from "next/navigation";

type EventDataType = {
  id: string;
  name: string;
  location: string;
  startTime: string;
  endTime: string;
  rating: number | null;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
  } | null;
  updatedBy: {
    name: string | null;
  } | null;
  assignments: {
    user: {
      name: string | null;
      image: string | null;
    } | null;
    role: {
      name: string;
    } | null;
  }[];
  availabilities: {
    availabilityEntries: {
      user: {
        name: string | null;
        image: string | null;
      };
    }[];
    role: {
      name: string;
    };
    totalSlots: number;
  }[];
  status: "LIVE" | "ENDED" | "UPCOMING";
};

function LiveEvents() {
  const { data, isLoading, pagination, refetch } = usePaginatedData<
    EventDataType[]
  >(`/api/admin/events?status=LIVE`, []);

  const router = useRouter();

  return (
    <>
      {isLoading ? (
        <div className="flex bg-gray-100/60 items-center  rounded-lg shadow-lg p-2 justify-center">
          <ImSpinner9 className="animate-spin" size={20} />
        </div>
      ) : (
        <div
          className={`${data.length === 0 ? "hidden" : "flex"} p-2 flex-col md:w-fit w-90 opacity-90 items-center bg-gray-200 rounded-xl gap-2`}
        >
          <div className="flex px-2 w-full items-center text-center justify-between">
            <div className="flex flex-col items-start justify-center">
              <h3 className="uppercase cursor-default leading-6 font-bold text-xl text-blue-950">
                Live Events
              </h3>
              <p className="text-xs text-gray-500 leading-6">
                Events Currently Live
              </p>
            </div>
            <button
              onClick={() => router.push("admin/events")}
              className="text-md underline cursor-pointer transition-all duration-300 ease-out hover:text-blue-500 text-blue-700"
            >
              See All
            </button>
          </div>
          <div className="flex gap-2 px-1 flex-col overflow-x-auto snap-x snap-mandatory  pb-2">
            {data.map((event) => (
              <div key={event.id} className="flex shrink-0 snap-center">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default LiveEvents;
