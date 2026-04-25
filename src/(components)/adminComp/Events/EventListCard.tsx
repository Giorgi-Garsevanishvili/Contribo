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
};
function EventsListCard({ event }: { event: EventDataType }) {
  const { openModal } = useModal();
  const availableSlots = event.availabilities.reduce(
    (acc, curr) => acc + curr.totalSlots,
    0,
  );
  return (
    <div
      onClick={() =>
        openModal(
          <div className="bg-amber-50">Here We Are: {event.startTime}</div>,
        )
      }
      className="flex hover:shadow-blue-700 group transition-all duration-300 ease-out cursor-pointer rounded-sm overflow-hidden shadow-sm bg-white shadow-gray-500 w-full h-fit"
    >
      <div className="flex w-30 shrink-0 rounded-sm h-auto shadow-inner shadow-black  relative justify-center items-center overflow-hidden">
        <Image
          src={Photo2}
          fill
          className="object-cover  overflow-hidden"
          alt="EventPhoto"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,transparent_40%,rgba(0,0,0,0.35))]" />
        <div className="absolute z-10 group-hover:shadow-blue-700 shadow transition-all duration-300 ease-out flex uppercase items-center font-bold justify-center top-2 left-2 w-20 h-fit gap-1 group-hover:bg-blue-50 bg-gray-200 rounded-sm">
          <p className="text-sm h-fit w-fit text-blue-900">
            {new Date(event.startTime).toLocaleString("en-US", {
              month: "short",
            })}
          </p>
          <p className="text-black h-fit w-fit text-sm">
            {" "}
            {new Date(event.startTime).getDate()}
          </p>
        </div>
      </div>
      <div className="flex w-full gap-2 p-2">
        <div className="flex flex-col items-start justify-start">
          <h3 className="font-bold text-sm text-gray-800">{event.name}</h3>

          <div className="flex gap-1 text-xs items-center text-center text-gray-400 w-full h-fit">
            {availableSlots === 0 ? (
              <HiXCircle size={10} color="red" />
            ) : (
              <FaCheckCircle size={10} color="green" />
            )}
            <h5>{availableSlots} Slots Available</h5>
          </div>
          <div className="flex gap-1 text-xs items-center text-center text-gray-400 w-full h-fit">
            <div>
              <IoIosTime size={10} />
            </div>
            <h5 className="truncate">{`${new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}</h5>
          </div>
          <div className="flex gap-1 text-xs items-center text-center text-gray-400 w-full h-fit">
            <div>
              <FaLocationDot size={10} />
            </div>
            <h5 className="truncate">{event.location}</h5>
          </div>
          <div className="flex gap-1 text-xs items-center text-center text-gray-400 w-full h-fit">
            <div>
              <FaCalendarAlt size={10} />
            </div>
            <h5 className="truncate">{`${new Date(event.startTime).toLocaleDateString()}`}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsListCard;
