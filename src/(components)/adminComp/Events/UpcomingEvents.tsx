"use client";
import usePaginatedData from "@/hooks/usePaginatedData";
import EventCard from "./EventCard";
import { ImSpinner9 } from "react-icons/im";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { BsBroadcast } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";

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

function UpcomingEvents() {
  const { data, isLoading, pagination, refetch } = usePaginatedData<
    EventDataType[]
  >(`/api/admin/events/upcomingEvents`, []);

  const router = useRouter();

  return (
    <>
      {isLoading ? (
        <div className="flex bg-gray-50 items-center  rounded-lg shadow-lg p-2 justify-center">
          <ImSpinner9 className="animate-spin" size={20} />
        </div>
      ) : (
        <div
          className={`${data.length === 0 ? "hidden" : "flex"} p-2 flex-col md:w-full w-90  bg-gray-50 rounded-md gap-2`}
        >
          <div className="flex px-2 border-b border-gray-300 p-1 w-full relative items-center text-center justify-start gap-3">
            <div className="flex items-center p-2 justify-center bg-gray-200 rounded-md">
              <IoCalendarOutline size={22} className="text-blue-600 animate-pulse" />
            </div>
            <div className="flex flex-col items-start justify-center">
              <h3 className=" cursor-default leading-6 font-bold text-xl text-blue-950">
                Upcoming Events
              </h3>
              <p className="text-xs text-gray-500 leading-6">
                Events For Next 7 Days
              </p>
            </div>
            <button
              onClick={() => router.push("admin/events")}
              className="text-xs absolute right-2 cursor-pointer flex gap-1 items-center justify-center transition-all duration-300 ease-out hover:text-blue-400 text-blue-600"
            >
              View All <IoIosArrowForward />
            </button>
          </div>
          <div className="flex gap-2 px-1 overflow-x-auto snap-x snap-mandatory  pb-2">
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

export default UpcomingEvents;
