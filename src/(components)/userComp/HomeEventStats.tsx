"use client";
import usePaginatedData from "@/hooks/usePaginatedData";
import { useEffect } from "react";
import {
  AiFillCheckCircle,
  AiFillPlayCircle,
  AiOutlineAlert,
  AiOutlineAppstore,
} from "react-icons/ai";
import { CiCalendar } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { ImSpinner9 } from "react-icons/im";
import { LuPartyPopper } from "react-icons/lu";
import { MdEventAvailable } from "react-icons/md";
import { PiUserCircleCheck } from "react-icons/pi";

type EventStatus = "LIVE" | "ENDED" | "UPCOMING";

type EventResponse = {
  status: EventStatus;
  id: string;
  name: string;
  location: string;
  startTime: Date;
  endTime: Date;
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
    _count: {
      availabilityEntries: number;
    };

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
};

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type DashboardStats = {
  totalEvents: number;
  assignedEvents: number;
  attendedEvents: number;
  upcomingEvents: number;
  endedEvents: number;
  liveEvents: number;
  totalDurationHours: string;
  totalAvailableSlots: number;
};

type ApiResponse = {
  data: EventResponse[];
  pagination: PaginationMeta;
  stats: DashboardStats;
};

function HomeEventStats() {
  const { data, isLoading, stats, refetch } =
    usePaginatedData<ApiResponse | null>(`/api/user/events/myStats`, null);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return isLoading ? (
    <div className="flex w-full animate-pulse md:w-[80%] bg-gray-50 items-center  rounded-lg shadow-lg p-2 justify-center">
      <ImSpinner9 className="animate-spin" size={20} />
    </div>
  ) : (
    stats && (
      <div className="p-2 flex-wrap flex-col md:w-[80%] w-100 shadow  bg-gray-50 rounded-md gap-1 flex">
        <div className="flex p-1 gap-2 flex-wrap w-full text-sm text-center  h-fit items-center justify-between border-gray-300">
          <div className="flex select-none gap-1 w-40 flex-col p-2 items-center border border-gray-600/40  rounded-md grow   justify-center">
            <div className="flex items-center justify-center gap-3">
              <CiCalendar className="text-blue-500" size={20} />
              <h3 className="font-semibold text-md">
                {stats.upcomingEvents || 0}
              </h3>
            </div>
            <h3 className="text-xs text-gray-600">My Upcoming Events</h3>
          </div>

          <div className="flex select-none gap-1 w-40 flex-col p-2 items-center border border-gray-600/40  rounded-md grow   justify-center">
            <div className="flex items-center justify-center gap-3">
              <MdEventAvailable className="text-green-700" size={20} />
              <h3 className="font-semibold text-md">
                {stats.attendedEvents || 0}
              </h3>
            </div>
            <h3 className="text-xs text-gray-600">My Attended Events</h3>
          </div>

          <div className="flex select-none gap-1 w-40 flex-col p-2 items-center border border-gray-600/40  rounded-md grow   justify-center">
            <div className="flex items-center justify-center gap-3">
              <AiOutlineAppstore size={20} className="text-blue-500" />
              <h3 className="font-semibold text-md">
                {stats.totalEvents || 0}
              </h3>
            </div>
            <h3 className="text-xs text-gray-600">Total Events</h3>
          </div>

          <div className="flex select-none gap-1 w-40 flex-col p-2 items-center border border-gray-600/40  rounded-md grow   justify-center">
            <div className="flex items-center justify-center gap-3">
              <PiUserCircleCheck className="text-orange-500" size={20} />
              <h3 className="font-semibold text-md">
                {stats.assignedEvents || 0}
              </h3>
            </div>
            <h3 className="text-xs text-gray-600">My Assignments</h3>
          </div>

          <div className="flex select-none gap-1 w-40 flex-col p-2 items-center border border-gray-600/40  rounded-md grow   justify-center">
            <div className="flex items-center justify-center gap-3">
              <GoClock className="text-purple-500" size={20} />
              <h3 className="font-semibold text-md">
                {stats.totalDurationHours}h
              </h3>
            </div>
            <h3 className="text-xs text-gray-600">Total Duration</h3>
          </div>

          <div className="flex select-none gap-1 w-40 flex-col p-2 items-center border border-gray-600/40  rounded-md grow   justify-center">
            <div className="flex items-center justify-center gap-3">
              <AiFillPlayCircle className="text-green-700" size={20} />
              <h3 className="font-semibold text-md">{stats.liveEvents}</h3>
            </div>
            <h3 className="text-xs text-gray-600">Live Events</h3>
          </div>
        </div>
      </div>
    )
  );
}

export default HomeEventStats;
