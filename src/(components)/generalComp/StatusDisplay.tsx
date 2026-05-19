import React from "react";
import { FaCheck, FaCircle, FaClock } from "react-icons/fa6";

function StatusDisplay({ status }: { status: "LIVE" | "ENDED" | "UPCOMING" }) {
  return (
    <div
      className={`flex items-center ${status === "LIVE" ? "text-green-600 border-green-600/50 bg-green-600/10" : status === "UPCOMING" ? "text-blue-500 border-blue-500/50 bg-blue-500/10" : "text-gray-700 border-gray-700/50 bg-gray-700/10"} border rounded-sm font-semibold  p-1 text-xs justify-center gap-2 w-fit`}
    >
      <h3>
        {status === "LIVE"
          ? "LIVE"
          : status === "UPCOMING"
            ? "UPCOMING"
            : "ENDED"}
      </h3>
      {status === "LIVE" ? (
        <FaCircle size={10} />
      ) : status === "UPCOMING" ? (
        <FaClock />
      ) : (
        <FaCheck />
      )}
    </div>
  );
}

export default StatusDisplay;
