"use client";
import usePaginatedData from "@/hooks/usePaginatedData";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { useSession } from "next-auth/react";
import { BiSolidBookmarkHeart } from "react-icons/bi";

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
  startTime: string;
  description: string | null;
  endTime: string;
  rating: number | null;
  assignments: {
    user: {
      id: string;
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

function WelcomeBack() {
  const { data: session } = useSession();
  const { data, isLoading, counts, refetch } = usePaginatedData<
    EventDataType[]
  >(`/api/user/events?status=FUTURE&assignee=${session?.user.userId}`, []);

  const router = useRouter();

  return (
    <>
      {
        <div
          className={`flex p-2 flex-col md:w-[80%] w-100 shadow  bg-gray-50 rounded-md gap-2`}
        >
          <div className="flex px-1 p-1 w-full md:flex-row flex-col relative items-center text-center justify-start gap-3">
            <div className="flex items-center p-1 justify-center bg-gray-200 rounded-lg">
              <BiSolidBookmarkHeart size={45} className="text-blue-600" />
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
              <h3 className=" cursor-default items-center justify-center leading-6 font-bold text-2xl text-blue-950">
                Welcome Back, {session?.user.name?.split(" ")[0]}!
              </h3>
              <p className="text-sm text-gray-500 leading-6">
                Here`s what`s happening with your events.
              </p>
            </div>
            <button
              onClick={() => router.push("volunteer/events")}
              className="text-sm text-center font-semibold w-full md:w-fit md:absolute md:right-1 cursor-pointer flex gap-1 items-center justify-center transition-all duration-300 ease-out bg-blue-800 p-2 rounded-md hover:bg-blue-400 text-white"
            >
              View All Events <IoIosArrowForward size={16} />
            </button>
          </div>
          {/* <div className="flex border-t p-2 w-full text-sm text-center  h-fit items-center justify-between border-gray-300">
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
          </div> */}
        </div>
      }
    </>
  );
}

export default WelcomeBack;
