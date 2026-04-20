"use client";
import usePaginatedData from "@/hooks/usePaginatedData";
import EventCard from "./EventCard";
import { ImSpinner9 } from "react-icons/im";

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
    role: {
      name: string;
    } | null;
    user: {
      name: string | null;
      image: string | null;
    } | null;
  }[];
  availabilities: {
    role: {
      name: string;
    };
    availabilityEntries: {
      user: {
        name: string | null;
        image: string | null;
      };
    }[];
  }[];
};

function UpcomingEvents() {
  const { data, isLoading, pagination, refetch } = usePaginatedData<
    EventDataType[]
  >(`/api/admin/events?limit=4`, []);

  return (
    <>
      {isLoading ? (
        <div className="flex bg-gray-100/60 items-center  rounded-lg shadow-lg p-2 justify-center">
          <ImSpinner9 className="animate-spin" size={20} />
        </div>
      ) : (
        <div className="flex p-2 flex-col md:w-full w-90  bg-gray-200 rounded-xl gap-2">
          <div className="flex p-2 w-full items-center text-center justify-between">
            <h3 className="uppercase cursor-default leading-6 font-bold text-xl text-blue-950">
              Upcoming Events
            </h3>
            <button className="text-md underline cursor-pointer transition-all duration-300 ease-out hover:text-blue-500 text-blue-700">
              See All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
            {data.map((event) => (
              <div key={event.id} className="flex shrink-0 snap-start">
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
