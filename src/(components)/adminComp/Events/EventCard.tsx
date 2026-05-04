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

function EventCard({ event }: { event: EventDataType }) {
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
      className={`flex ${event.status === "LIVE" && "animate-pulse animation-duration-3000"} hover:shadow-blue-700 group transition-all duration-300 ease-out flex-col cursor-pointer rounded-sm overflow-hidden relative shadow-sm bg-white shadow-gray-500 w-2xs h-fit`}
    >
      <div className="flex w-full h-35 shadow-inner shadow-black  relative justify-center items-center overflow-hidden">
        <Image
          src={Photo3}
          fill
          className="object-cover  overflow-hidden"
          alt="EventPhoto"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,transparent_40%,rgba(0,0,0,0.35))]" />
        <div className="absolute z-10 group-hover:shadow-blue-700 shadow transition-all duration-300 ease-out flex flex-col uppercase items-center font-bold justify-center top-2 left-2 w-15 h-fit group-hover:bg-blue-50 bg-gray-200 rounded-sm">
          <p className="text-md h-fit w-fit text-blue-900">
            {new Date(event.startTime).toLocaleString("en-US", {
              month: "short",
            })}
          </p>
          <p className="text-black h-fit w-fit text-2xl">
            {" "}
            {new Date(event.startTime).getDate()}
          </p>
        </div>
      </div>
      <div className="flex relative w-full gap-2 flex-col p-2">
        <div className="absolute flex right-2 top-2">
          <StatusDisplay status={event.status} />
        </div>
        <h3 className="font-bold text-gray-800">{event.name}</h3>
        <div className="flex flex-col gap-0.5">
          <div className="flex  text-gray-400 shrink-0 items-center justify-start gap-2">
            {availableSlots === 0 ? (
              <HiXCircle size={15} color="red" />
            ) : (
              <FaCheckCircle size={15} color="green" />
            )}
            <h5>{availableSlots} Slots Available</h5>
          </div>
          <div className="flex gap-2 items-center text-center text-gray-400 w-full h-fit">
            <div>
              <FaLocationDot size={15} />
            </div>
            <h5 className="truncate">{event.location}</h5>
          </div>
          <div className="flex gap-2 items-center text-center text-gray-400 w-full h-fit">
            <div>
              <IoIosTime size={15} />
            </div>
            <h5 className="truncate">{`${new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}</h5>
          </div>
          <div className="flex gap-2 items-center text-center text-gray-400 w-full h-fit">
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

export default EventCard;
