"use client";

import Image from "next/image";
import Photo1 from "../../../../public/eventPhotos/eventPhoto1.jpg";
import Photo2 from "../../../../public/eventPhotos/eventPhoto2.jpg";
import Photo3 from "../../../../public/eventPhotos/eventPhoto3.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { useModal } from "../../../../context/ModalContext";
import { HiXCircle } from "react-icons/hi2";
import RoleAvailabilityComp from "./RoleAvailabilityComp";
import StatusDisplay from "./StatusDisplay";

type EventDataType = {
  status: "LIVE" | "ENDED" | "UPCOMING";
  id: string;
  rating: number | null;
  name: string;
  location: string;
  startTime: string;
  endTime: string;
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
    totalSlots: number;
  }[];
};

function LiveEventsCard({ event }: { event: EventDataType }) {
  const { openModal } = useModal();
  const availableSlots = event.availabilities.reduce(
    (acc, curr) => acc + curr.totalSlots,
    0,
  );
  return (
    <div
      onClick={() =>
        openModal(
          "Event Details",
          `${event.name}`,
          <RoleAvailabilityComp props={event} />,
        )
      }
      className={`flex ${event.status === "LIVE" && "animate-pulse animation-duration-3000"} hover:shadow-blue-700 group transition-all duration-300 ease-out cursor-pointer hover:animate-none rounded-sm overflow-hidden relative gap-3  shadow-sm bg-white shadow-gray-500 w-xs flex p-3 justify-between h-fit`}
    >
      <div className="flex items-center rounded-md overflow-hidden shadow shadow-gray-500/30 h-fit w-15 shrink-0 flex-col justify-start">
        <p className="text-xs p-1 h-fit  flex-col w-full flex items-center font-semibold justify-center text-white bg-blue-900">
          {new Date(event.startTime).toLocaleString("en-US", {
            month: "short",
          })}
        </p>
        <p className="text-black p-1 h-fit w-fit text-2xl">
          {" "}
          {new Date(event.startTime).getDate()}
        </p>
      </div>
      <div className="absolute flex right-2 top-2">
        <StatusDisplay status={event.status} />
      </div>
      <div className="flex relative gap-2  flex-col">
        <h3 className="font-bold w-fit text-gray-800">{event.name}</h3>
        <div className="flex text-sm text-gray-500  flex-col grow gap-1 w-fit">
          <div className="flex  shrink-0 w-fit items-center justify-start gap-2">
            {availableSlots === 0 ? (
              <HiXCircle size={15} color="red" />
            ) : (
              <FaCheckCircle size={15} color="green" />
            )}
            <h5>{availableSlots} Slots Available</h5>
          </div>
          <div className="flex gap-2 items-center text-center w-[50%] h-fit">
            <div>
              <FaLocationDot size={15} />
            </div>
            <h5 className="truncate">{event.location}</h5>
          </div>
          <div className="flex gap-2 items-center text-center w-fit h-fit">
            <div>
              <IoIosTime size={15} />
            </div>
            <h5 className="truncate">{`${new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}</h5>
          </div>
          <div className="flex gap-2 items-center text-center w-fit h-fit">
            <div>
              <FaCalendarAlt size={15} />
            </div>
            <h5 className="truncate">{`${new Date(event.startTime).toLocaleDateString()}`}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveEventsCard;
