import { ReqStatus } from "@/generated/enums";
import Image from "next/image";
import { FcDeleteDatabase } from "react-icons/fc";
import { IoMdGlobe } from "react-icons/io";
import JoinReqDetails from "./JoinReqDetails";
import JoinReqActions from "./JoinReqActions";

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
  updatedAt: string;
  updatedBy: { name: string | null };
};

function JoinRequestCard({
  joinData,
  refetch,
}: {
  joinData: Data;
  refetch: () => void;
}) {
  const statusKey = joinData.status as keyof typeof JOIN_STATUS_COLORS;
  const statusColors = JOIN_STATUS_COLORS[statusKey];
  return (
    <div
      className={`md:grid ${joinData.status === "REJECTED" || joinData.status === "APPROVED" ? " opacity-50" : ""} relative content-center flex flex-col  w-full  md:grid-cols-[1fr_1fr_1fr_1fr_0.8fr] gap-1 md:gap-7 md:grid-rows-1  bg-white/80 select-none text-sm justify-start items-center px-3 text-black p-1 m-1 rounded-lg`}
    >
      <div className="flex md:w-auto w-full  border-b border-gray-600/30 rounded-md md:border-0 p-1 justify-start truncate items-center">
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

      <div className="flex w-full justify-center items-center gap-2">
        <h3 className="flex w-full md:hidden font-bold">Region Requested:</h3>
        <div className="flex w-full justify-center font-medium gap-2">
          <IoMdGlobe size={18} className="text-gray-500" />
          <h3>{joinData.region?.name}</h3>
        </div>
      </div>

      <div className="flex w-full justify-center items-center gap-2">
        <h3 className="flex w-full md:hidden font-bold">Requested Date:</h3>
        <h3 className="flex w-full justify-center text-gray-600 truncate">
          {joinData.requestedAt
            ? new Date(joinData.requestedAt).toDateString()
            : "No Data"}
        </h3>
      </div>

      <div className="flex w-full justify-center items-center gap-2">
        <h3 className="flex md:hidden font-bold">Status:</h3>
        <div
          className={`flex border w-full rounded-md p-0.5 md:p-1 ${statusColors.bg} ${statusColors.border} ${statusColors.font} justify-center text-xs md:text-sm font-medium truncate`}
        >
          {joinData.region ? joinData.status : "No Data"}
        </div>
      </div>

      <div className="flex gap-1.5 m-2 md:m-0 w-full justify-center items-center">
        {joinData.status === "REJECTED" || joinData.status === "APPROVED" ? (
          <JoinReqDetails joinData={joinData} />
        ) : (
          <JoinReqActions
            id={joinData.id}
            refetch={refetch}
            currentStatus={joinData.status}
          />
        )}
      </div>
    </div>
  );
}

export default JoinRequestCard;
