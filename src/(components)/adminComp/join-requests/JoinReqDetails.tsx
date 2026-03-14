import { ReqStatus } from "@/generated/enums";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { JOIN_STATUS_COLORS } from "./JoinRequestCard";

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

function JoinReqDetails({ joinData }: { joinData: Data }) {
  const [isOpen, setIsOpen] = useState(false);
  const statusKey = joinData.status as keyof typeof JOIN_STATUS_COLORS;
  const statusColors = JOIN_STATUS_COLORS[statusKey];

  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-center text-orange-700 cursor-pointer hover:underline transition-all duration-200"
        >
          View Details
        </button>
      ) : (
        <div
          className={`${isOpen ? "flex" : "hidden"} justify-between items-center absolute w-full h-full bg-gray-800/70 p-5 bottom-0 left-0  rounded-md shadow-md shadow-white `}
        >
          <div className="flex flex-col md:flex-row gap-2 md:items-center rounded-md bg-white w-full p-1 h-auto justify-start">
            <h2 className="text-xs flex grow gap-1 italic ">
              <strong>Updated By:</strong>
              {joinData.updatedBy?.name
                ? joinData.updatedBy?.name
                : "No Creator Data"}
            </h2>
            <h2 className="text-xs grow flex gap-1 italic ">
              <strong>Updated At: </strong>
              {joinData.updatedAt
                ? new Date(joinData.updatedAt).toLocaleString()
                : "No Data"}
            </h2>

            <div className="flex justify-center items-center gap-2">
              <h3 className="flex font-bold">Status:</h3>
              <div
                className={`flex border w-full rounded-md p-0.5 md:p-1 ${statusColors.bg} ${statusColors.border} ${statusColors.font} justify-center text-xs md:text-sm font-medium truncate`}
              >
                {joinData.region ? joinData.status : "No Data"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn border border-gray-900/90 bg-gray-100/85 items-center rounded-2xl shadow-lg p-0.5 justify-center"
          >
            <IoIosCloseCircle size={32} />
          </button>
        </div>
      )}
    </>
  );
}

export default JoinReqDetails;
