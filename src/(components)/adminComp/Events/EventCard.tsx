"use client";

import Image from "next/image";
import Photo1 from "../../../../public/eventPhotos/eventPhoto1.jpg";
import Photo2 from "../../../../public/eventPhotos/eventPhoto2.jpg";
import Photo3 from "../../../../public/eventPhotos/eventPhoto3.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";
import { IoIosTime } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";

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

function EventCard({ event }: { event: EventDataType }) {
  return (
    <div className="flex hover:shadow-blue-700 group transition-all duration-300 ease-out flex-col cursor-pointer rounded-sm overflow-hidden shadow-sm bg-white shadow-gray-500 w-2xs h-fit">
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
      <div className="flex w-full gap-2 flex-col p-2">
        <h3 className="font-bold text-gray-800">{event.name}</h3>
        <div className="flex flex-col gap-0.5">
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
            <h5 className="truncate">{`${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()}`}</h5>
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
