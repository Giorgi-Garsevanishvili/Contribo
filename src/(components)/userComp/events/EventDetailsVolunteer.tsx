"use client";
import { FaCalendarAlt } from "react-icons/fa";
import { EventLocationDisplay } from "@/lib/EventLocationDisplay";
import { IoIosTime } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { useModal } from "../../../../context/ModalContext";
import { TbPencilOff, TbUserCheck, TbUserSearch } from "react-icons/tb";
import { Loader } from "lucide-react";
import { useState } from "react";
import { BiSolidDetail } from "react-icons/bi";
import StatusDisplay from "@/(components)/generalComp/StatusDisplay";

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

function EventDetailsVolunteer({
  event,
  parentRefetch,
  isLoading,
}: {
  event: EventDataType | null;
  isLoading: boolean;
  parentRefetch: () => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const { closeModal } = useModal();

  const handleDelete = () => {
    parentRefetch();
    closeModal();
  };

  const takenSlots =
    event?.availabilities.reduce(
      (acc, curr) => acc + curr._count.availabilityEntries,
      0,
    ) || 0;
  const totalAvailableSlots =
    event?.availabilities.reduce((acc, curr) => acc + curr.totalSlots, 0) || 0;

  return isLoading ? (
    <div className="flex w-full h-full items-center justify-center">
      <Loader
        className="right-3 top-2.5 animate-spin text-gray-200"
        size={40}
      />
    </div>
  ) : event ? (
    <div className="flex w-full flex-col items-center justify-start border border-gray-400/30 rounded-md bg-cyan-900 p-2 gap-5">
      <div className="flex items-start  md:justify-end w-full  py-1  justify-between gap-3">
        <div className="bg-white w-fit h-fit rounded-md">
          <StatusDisplay status={event.status} />
        </div>
      </div>
      <div
        className={`${editOpen ? "hidden" : "flex"} w-full flex-col items-center justify-between gap-5 px-2`}
      >
        <div className="flex items-start flex-col md:flex-row  md:justify-end w-full  py-1  justify-between gap-3">
          <div className="flex w-full h-full gap-4">
            <div className="flex items-center justify-between bg-white rounded-md overflow-hidden shadow shadow-gray-500/30 h-full w-25 shrink-0 flex-col">
              <p className="text-md p-1 h-[35%]  flex-col w-full flex items-center font-semibold justify-center text-white bg-blue-900">
                {new Date(event.startTime).toLocaleString("en-US", {
                  month: "short",
                })}
              </p>
              <p className="text-black font-bold p-1 h-full flex items-center w-fit text-4xl">
                {" "}
                {new Date(event.startTime).getDate()}
              </p>
            </div>
            <div className="flex justify-center truncate items-start h-full w-fit flex-col gap-1">
              <h1 className="text-2xl font-semibold">{event.name}</h1>
              <div className="flex gap-2 items-center text-center w-fit h-fit">
                <div>
                  <IoIosTime size={15} />
                </div>
                <h5 className="truncate">{`${new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}</h5>
              </div>
              <div className="flex gap-2 items-center text-center w-fit h-fit">
                <div className="text-gray-200">
                  <FaCalendarAlt size={15} />
                </div>
                <h5 className="truncate text-gray-200">{`${new Date(event.startTime).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} - ${new Date(event.endTime).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`}</h5>
              </div>
              <div className="flex gap-2 items-center text-center w-fit h-fit">
                <BiSolidDetail size={15} />
                {event.description || "Description is not provided"}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 gap-2 w-full md:w-fit">
            <div className="flex bg-green-600/30 rounded-md px-2 py-1 flex-col w-fit grow h-full gap-2">
              <div className="flex gap-2 text-xl items-center justify-start">
                <TbUserCheck className="text-green-500" size={30} />
                {event.assignments.length}
              </div>
              <h3>Assignments</h3>
            </div>
            <div className="flex bg-cyan-600/30 rounded-md px-2 py-1 flex-col w-fit grow h-full gap-2">
              <div className="flex gap-2 text-xl items-center justify-start">
                <TbUserSearch className="text-cyan-500" size={30} />
                {totalAvailableSlots - takenSlots}
              </div>
              <h3>Personnel Required</h3>
            </div>
          </div>
        </div>
        <div className="flex w-full rounded-md bg-gray-400/40 p-2">
          <EventLocationDisplay location={event.location} />
        </div>
      </div>
    </div>
  ) : null;
}

export default EventDetailsVolunteer;
