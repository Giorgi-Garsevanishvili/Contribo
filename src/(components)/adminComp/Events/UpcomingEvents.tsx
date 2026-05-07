"use client";
import usePaginatedData from "@/hooks/usePaginatedData";
import EventCard from "./EventCard";
import { ImSpinner9 } from "react-icons/im";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { PiUserCircleCheck } from "react-icons/pi";
import { GoClock } from "react-icons/go";
import { AiOutlineAlert } from "react-icons/ai";

type EventDataType = {
  status: "LIVE" | "ENDED" | "UPCOMING";
  id: string;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
  } | null;
  updatedBy: {
    name: string | null;
  } | null;
  name: string;
  location: string;
  startTime: Date;
  endTime: Date;
  rating: number | null;
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
    _count: {
      availabilityEntries: number;
    };
    role: {
      name: string;
    };
    availabilityEntries: {
      user: {
        name: string | null;
        image: string | null;
      };
    }[];
    totalSlots: number;
  }[];
};

function UpcomingEvents() {
  const { data, isLoading, counts, refetch } = usePaginatedData<
    EventDataType[]
  >(`/api/admin/events?status=FUTURE`, []);

  const router = useRouter();

  return (
    <>
      {isLoading ? (
        <div className="flex bg-gray-50 items-center  rounded-lg shadow-lg p-2 justify-center">
          <ImSpinner9 className="animate-spin" size={20} />
        </div>
      ) : (
        <div
          className={`${data.length === 0 ? "hidden" : "flex"} p-2 flex-col md:w-[80%] w-100 shadow  bg-gray-50 rounded-md gap-2`}
        >
          <div className="flex px-2 border-b border-gray-300 p-1 w-full relative items-center text-center justify-start gap-3">
            <div className="flex items-center p-2 justify-center bg-gray-200 rounded-md">
              <IoCalendarOutline
                size={22}
                className="text-blue-600"
              />
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
                <EventCard parentRefetch={refetch} event={event} />
              </div>
            ))}
          </div>
          <div className="flex border-t p-2 w-full text-sm text-center  h-fit items-center justify-between border-gray-300">
            <div className="flex select-none gap-1 w-full flex-col p-2 items-center justify-center">
              <div className="flex items-center justify-center gap-3">
                <AiOutlineAlert className="text-blue-500" />
                <h3 className="font-semibold text-md">{data.length}</h3>
              </div>
              <h3 className="text-xs text-gray-600">Upcoming Events</h3>
            </div>
            <div className="border-l border-gray-300 h-7 w-1"></div>
            <div className="flex select-none gap-1 w-full flex-col p-2 items-center justify-center">
              <div className="flex items-center justify-center gap-3">
                <PiUserCircleCheck className="text-green-500" />
                <h3 className="font-semibold text-md">
                  {counts?.availabilityCounts}
                </h3>
              </div>
              <h3 className="text-xs text-gray-600">Slots Available</h3>
            </div>
            <div className="border-l border-gray-300 h-7 w-1"></div>
            <div className="flex select-none gap-1 w-full flex-col p-2 items-center justify-center">
              <div className="flex items-center justify-center gap-3">
                <GoClock className="text-purple-500" />
                <h3 className="font-semibold text-md">
                  {counts?.totalDuration}h
                </h3>
              </div>
              <h3 className="text-xs text-gray-600">Duration</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UpcomingEvents;
