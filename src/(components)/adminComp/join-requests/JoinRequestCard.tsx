import { ReqStatus } from "@/generated/enums";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { FcDeleteDatabase } from "react-icons/fc";
import { IoMdGlobe } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export const JOIN_STATUS_COLORS = {
  APPROVED: {
    bg: "bg-green-300/20",
    border: "border-green-500",
    font: "text-green-800",
  },
  PENDING: {
    bg: "bg-orange-300/20",
    border: "border-orange-500",
    font: "text-orange-800",
  },
  REQUESTED: {
    bg: "bg-yellow-300/20",
    border: "border-yellow-500",
    font: "text-yellow-800",
  },
  REJECTED: {
    bg: "bg-red-300/20",
    border: "border-red-500",
    font: "text-red-800",
  },
} as const;

const STATUS_ORDER = ["APPROVED", "PENDING", "REQUESTED", "REJECTED"];

type Data = {
  id: string;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
    image: string | null;
  };
  status: ReqStatus;
  requestedAt: string;
};

function JoinRequestCard({ joinData }: { joinData: Data }) {
  const statusKey = joinData.status as keyof typeof JOIN_STATUS_COLORS;
  const statusColors = JOIN_STATUS_COLORS[statusKey];
  return (
    <div
      className={`md:grid  relative content-center bg-white/80 flex flex-col  w-full  md:grid-cols-[1fr_1fr_1fr_1fr_0.8fr] gap-1 md:gap-7 md:grid-rows-1 select-none text-sm justify-start items-center px-3 text-black p-1 m-1 rounded-lg`}
    >
      <div className="flex  border-b border-gray-600/30 rounded-md md:border-0 p-1 justify-start truncate items-center">
        {joinData.createdBy?.image ? (
          <Image
            priority
            className="rounded-lg"
            src={joinData.createdBy.image}
            alt="User Image"
            width={35}
            height={35}
          />
        ) : (
          <div>
            <FcDeleteDatabase className="mr-2" size={40} />
          </div>
        )}
        <div className="flex grow justify-start truncate p-2">
          <h3 className="text-sm font-bold flex overflow-hidden truncate">
            {joinData.createdBy?.name}
          </h3>
        </div>
      </div>

      <div className="flex justify-center font-medium gap-2">
        <IoMdGlobe size={18} className="text-gray-500" />
        <h3>{joinData.region?.name}</h3>
      </div>

      <h3 className="flex justify-center text-gray-600 truncate">
        {joinData.requestedAt
          ? new Date(joinData.requestedAt).toDateString()
          : "No Data"}
      </h3>

      <h3
        className={`flex border rounded-md p-1 ${statusColors.bg} ${statusColors.border} ${statusColors.font} justify-center font-medium truncate`}
      >
        {joinData.region ? joinData.status : "No Data"}
      </h3>

      <div className="flex gap-1.5 justify-center items-center">
        {joinData.status === "REJECTED" || joinData.status === "APPROVED" ? (
          <button className="flex justify-center text-orange-700 cursor-pointer hover:underline transition-all duration-200">
            View Details
          </button>
        ) : (
          <>
            <button className="btn h-fit p-1.5 border border-green-800 bg-green-500/20  m-0 rounded-sm w-fit">
              <FaCheck size={15} />
            </button>
            <button className="btn h-fit p-1.5 border border-red-800 bg-red-500/20 m-0 rounded-sm w-fit">
              <IoClose size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default JoinRequestCard;
