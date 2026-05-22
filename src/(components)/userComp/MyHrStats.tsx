"use client";

import { HrWarningStatus, RatingAction } from "@/generated/enums";
import { CiStar } from "react-icons/ci";
import { FaRegFileAlt } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa6";
import { HiDocument } from "react-icons/hi2";
import { ImStarFull } from "react-icons/im";
import { MdBadge, MdCardMembership } from "react-icons/md";
import { PiChartLineDownBold, PiChartLineUpBold } from "react-icons/pi";

type UserStatsType = {
  updatedAt: Date | null;
  updatedBy: {
    name: string | null;
  } | null;
  _count: {
    providedFeedbacks: number;
  };
  name: string | null;
  image: string | null;
  rating: number;
  memberStatusLogs: {
    updatedAt: Date | null;
    createdAt: Date;
    createdBy: {
      name: string | null;
    } | null;
    updatedBy: {
      name: string | null;
    } | null;
    status: {
      name: string;
    } | null;
  }[];
  positionHistories: {
    createdAt: Date;
    createdBy: {
      name: string | null;
    } | null;
    ended: boolean;
    startedAt: Date;
    position: {
      name: string;
    } | null;
  }[];
  ratingHistory: {
    action: RatingAction;
  }[];
  hrWarnings: {
    type: {
      name: string;
    };
    status: HrWarningStatus;
  }[];
} | null;

function MyHrStats({ userData }: { userData: UserStatsType }) {
  const warningCountByType =
    userData?.hrWarnings.reduce(
      (acc, warning) => {
        const type = warning.type.name;

        acc[type] = (acc[type] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    ) ?? {};

  return (
    <div className="bg-gray-700 flex-col items-center shadow md:w-[80%] w-100 shadow-white text-white h-auto rounded-md grow flex">
      <h3>My Hr Statistics</h3>
      <div className="flex items-center justify-center">
        <div className="flex items-center md:w-[80%] grow flex-wrap w-100 p-1 gap-2 justify-center">
          <div
            className={`flex select-none bg-gray-900/50 gap-1 w-40 flex-col p-2 items-center border border-gray-100/40  rounded-md grow   justify-center`}
          >
            <div className="flex items-center justify-center gap-3">
              <ImStarFull className="text-orange-300" size={20} />
              <h3 className="font-semibold text-md">{userData?.rating || 0}</h3>
            </div>
            <h3 className="text-xs font-semibold text-gray-200">My Rating</h3>
          </div>
          <div
            className={`flex select-none bg-gray-900/50 gap-1 w-40 flex-col p-2 items-center border border-gray-100/40  rounded-md grow   justify-center`}
          >
            <div className="flex items-center justify-center gap-3">
              <HiDocument className="text-purple-300" size={20} />
              <h3 className="font-semibold text-md">
                {userData?.hrWarnings.filter((n) => n.status === "ACTIVE")
                  .length || 0}
              </h3>
            </div>
            <h3 className="text-xs font-semibold text-gray-200">
              Active HR Case
            </h3>
          </div>
          <div
            className={`flex select-none bg-gray-900/50 gap-1 w-40 flex-col p-2 items-center border border-gray-100/40  rounded-md grow   justify-center`}
          >
            <div className="flex items-center justify-center gap-3">
              <FaBriefcase className="text-yellow-400" size={20} />
              <h3 className="font-semibold text-md">
                {userData?.hrWarnings.length || 0}
              </h3>
            </div>
            <h3 className="text-xs font-semibold text-gray-200">
              Total Hr Case
            </h3>
          </div>
          {Object.entries(warningCountByType).map(([type, count]) => (
            <div
              key={type}
              className={`flex select-none bg-gray-900/50 gap-1 w-40 flex-col p-2 items-center border border-gray-100/40  rounded-md grow   justify-center`}
            >
              <div className="flex items-center justify-center gap-3">
                <FaRegFileAlt className="text-gray-400" size={20} />
                <h3 className="font-semibold text-md">{count || 0}</h3>
              </div>
              <h3 className="text-xs font-semibold text-gray-200">{type}</h3>
            </div>
          ))}
          <div
            className={`flex select-none bg-gray-900/50 gap-1 w-40 flex-col p-2 items-center border border-gray-100/40  rounded-md grow   justify-center`}
          >
            <div className="flex items-center justify-center gap-3">
              <PiChartLineUpBold className="text-green-400" size={20} />
              <h3 className="font-semibold text-md">
                {userData?.ratingHistory.filter((r) => r.action === "INCREASE")
                  .length || 0}
              </h3>
            </div>
            <h3 className="text-xs font-semibold text-gray-200">
              Score Increase
            </h3>
          </div>
          <div
            className={`flex select-none bg-gray-900/50 gap-1 w-40 flex-col p-2 items-center border border-gray-100/40  rounded-md grow   justify-center`}
          >
            <div className="flex items-center justify-center gap-3">
              <PiChartLineDownBold className="text-red-400" size={20} />
              <h3 className="font-semibold text-md">
                {userData?.ratingHistory.filter((r) => r.action === "DECREASE")
                  .length || 0}
              </h3>
            </div>
            <h3 className="text-xs font-semibold text-gray-200">
              Score Decrease
            </h3>
          </div>
          <div
            className={`flex select-none bg-gray-900/50 gap-1 w-40 flex-col p-2 items-center border border-gray-100/40  rounded-md grow   justify-center`}
          >
            <div className="flex items-center justify-center gap-3">
              <MdCardMembership className="text-cyan-400" size={20} />
              <h3 className="font-semibold text-md">
                {userData?.memberStatusLogs.map(
                  (status) => status.status?.name,
                ) || "No Specified"}
              </h3>
            </div>
            <h3 className="text-xs font-semibold text-gray-200">
              MemberShip Status
            </h3>
          </div>
          <div
            className={`flex select-none bg-gray-900/50 gap-1 w-40 flex-col p-2 items-center border border-gray-100/40  rounded-md grow   justify-center`}
          >
            <div className="flex items-center justify-center gap-3">
              <MdBadge className="text-gray-300" size={20} />
              <h3 className="font-semibold text-md">
                {userData?.positionHistories.map(
                  (status) => status.position?.name,
                ) || "No Specified"}
              </h3>
            </div>
            <h3 className="text-xs font-semibold text-gray-200">Position</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyHrStats;
