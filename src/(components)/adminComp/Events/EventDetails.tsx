"use client";
import { FaCalendarAlt } from "react-icons/fa";
import StatusDisplay from "./StatusDisplay";
import { EventLocationDisplay } from "@/lib/EventLocationDisplay";
import { IoIosTime } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import DeleteButtonAdmin from "../users/DeleteButtonAdmin";
import { useModal } from "../../../../context/ModalContext";
import { TbUserCheck, TbUserSearch } from "react-icons/tb";
import { useEffect, useState } from "react";
import usePaginatedData from "@/hooks/usePaginatedData";
import { useFetchData } from "@/hooks/useDataFetch";
import { Loader } from "lucide-react";

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

function EventDetails({
  event,
  parentRefetch,
}: {
  event: EventDataType;
  parentRefetch: () => void;
}) {
  const { closeModal } = useModal();

  const handleDelete = () => {
    parentRefetch();
    closeModal();
  };

  const { data, isLoadingFetch, refetch } = useFetchData<EventDataType>(
    `/api/admin/events/${event.id}`,
  );

  const takenSlots =
    data?.availabilities.reduce(
      (acc, curr) => acc + curr._count.availabilityEntries,
      0,
    ) || 0;
  const totalAvailableSlots =
    data?.availabilities.reduce((acc, curr) => acc + curr.totalSlots, 0) || 0;

  return isLoadingFetch ? (
    <div className="flex w-full h-full items-center justify-center">
      <Loader
        className="right-3 top-2.5 animate-spin text-gray-200"
        size={40}
      />
    </div>
  ) : data ? (
    <div className="flex w-full flex-col items-center justify-start border border-gray-400/30 rounded-md bg-cyan-900 p-2 gap-5">
      <div className="flex w-full md:flex-row flex-col items-center justify-between gap-5 px-2">
        <div className="flex w-full h-full gap-4">
          <div className="flex items-center justify-between bg-white rounded-md overflow-hidden shadow shadow-gray-500/30 h-full w-25 shrink-0 flex-col">
            <p className="text-md p-1 h-[35%]  flex-col w-full flex items-center font-semibold justify-center text-white bg-blue-900">
              {new Date(data.startTime).toLocaleString("en-US", {
                month: "short",
              })}
            </p>
            <p className="text-black font-bold p-1 h-full flex items-center w-fit text-4xl">
              {" "}
              {new Date(data.startTime).getDate()}
            </p>
          </div>
          <div className="flex justify-center truncate items-start h-full w-fit flex-col gap-1">
            <div className="flex items-center md:w-fit w-full  py-1  justify-between gap-3">
              <div className="bg-white w-fit h-fit rounded-md">
                <StatusDisplay status={data.status} />
              </div>
              <div className="flex gap-2 w-fit not-visited: items-center justify-center">
                <button
                  type="button"
                  className="cursor-pointer hover:text-orange-400 transition-all duration-300 ease-out p-1 bg-cyan-600/60 rounded-md"
                >
                  <MdOutlineEdit size={20} />
                </button>
                <DeleteButtonAdmin
                  url={`/api/admin/events/${data.id}`}
                  value={`Event: ${data.name}`}
                  styleClass="w-fit items-center justify-center p-1 bg-cyan-600/60 rounded-md p-0 m-0 h-fit text-gray-200 hover:text-red-400"
                  message="This Action will delete Event with all user related data"
                  fetchAction={handleDelete}
                />
              </div>
            </div>
            <h1 className="text-2xl font-semibold">{data.name}</h1>
            <div className="flex gap-2 items-center text-center w-fit h-fit">
              <div>
                <IoIosTime size={15} />
              </div>
              <h5 className="truncate">{`${new Date(data.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(data.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}</h5>
            </div>
            <div className="flex gap-2 items-center text-center w-fit h-fit">
              <div className="text-gray-200">
                <FaCalendarAlt size={15} />
              </div>
              <h5 className="truncate text-gray-200">{`${new Date(data.startTime).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} - ${new Date(data.endTime).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`}</h5>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2 w-full md:w-fit">
          <div className="flex bg-green-600/30 rounded-md px-2 py-1 flex-col w-fit grow h-full gap-2">
            <div className="flex gap-2 text-xl items-center justify-start">
              <TbUserCheck className="text-green-500" size={30} />
              {data.assignments.length}
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
        <EventLocationDisplay location={data.location} />
      </div>
    </div>
  ) : null;
}

export default EventDetails;
