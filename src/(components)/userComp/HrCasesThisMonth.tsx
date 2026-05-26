"use client";
import { RatingAction } from "@/generated/enums";
import usePaginatedData from "@/hooks/usePaginatedData";
import { ImSpinner9 } from "react-icons/im";
import RatingCardVolunteer from "./myRatingRecordsComps/RatingCardVolunteer";
import { useState } from "react";
import HrCaseCardVolunteer from "./myHrCases/HrCaseCardVolunteer";
import { GoDotFill } from "react-icons/go";

type HrCaseDataType = {
  id: string;
  name: string;
  status: string;
  comment: string;
  updatedAt: string | null;
  createdAt: string | null;
  createdBy: { name: string } | null;
  updatedBy: { name: string } | null;
  type: { name: string };
  assignee: {
    name: string;
  };
};

function HrCasesThisMonth() {
  const [isOpenId, setIsOpenId] = useState("");
  const { data, isLoading } = usePaginatedData<HrCaseDataType[]>(
    "/api/user/myHrCases?monthLimit=true",
    [],
  );
  return (
    <div className="p-2 flex-wrap items-center justify-center flex-col md:w-[80%] w-full bg-gray-700/70 shadow shadow-white rounded-md gap-1 flex">
      <div className="flex border-b border-gray-400/40 w-auto p-1 mb-2 items-center justify-center gap-2">
        <h3 className="w-fit items-center text-white text-center">
          HR Cases This Month
        </h3>
        <h2 className="bg-green-600/20 text-green-500 text-sm px-4 h-fit w-fit rounded-2xl">
          {data.length}
        </h2>
      </div>
      {isLoading ? (
        <div className="flex w-full animate-pulse  bg-gray-700   items-center  rounded-lg shadow-lg p-2 justify-center">
          <ImSpinner9 className="animate-spin" size={20} />
        </div>
      ) : data.length > 0 ? (
        data.map((hrCase) => (
          <HrCaseCardVolunteer
            key={hrCase.id}
            item={hrCase}
            isOpenId={isOpenId}
            setIsOpenId={setIsOpenId}
          />
        ))
      ) : (
        <h3 className="flex w-full items-center justify-center text-gray-400">
          You don`t have Hr Cases this month
        </h3>
      )}
    </div>
  );
}

export default HrCasesThisMonth;
