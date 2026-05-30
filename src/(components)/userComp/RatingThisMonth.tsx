"use client";
import { RatingAction } from "@/generated/enums";
import usePaginatedData from "@/hooks/usePaginatedData";
import { ImSpinner9 } from "react-icons/im";
import RatingCardVolunteer from "./myRatingRecordsComps/RatingCardVolunteer";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

type RatingDataType = {
  id: string;
  action: "INCREASE" | "DECREASE";
  createdBy: { name: string } | null;
  updatedBy: { name: string } | null;
  createdAt: string;
  updatedAt: string;
  newValue: number;
  oldValue: number;
  reason: string;
  user: { name: string } | null;
  value: number;
};

function RatingThisMonth() {
  const [isOpenId, setIsOpenId] = useState("");
  const { data, isLoading } = usePaginatedData<RatingDataType[]>(
    "/api/user/myRatingHistory?monthLimit=true",
    [],
  );

  const router = useRouter();

  return (
    <div className="p-2 flex-wrap relative items-center justify-center flex-col w-full bg-gray-700/70 shadow shadow-white rounded-md gap-1 flex">
      <div className="flex border-b border-gray-400/40 w-fit p-1 mb-2 items-center justify-center gap-2">
        <h3 className="w-fit items-center text-white text-center">
          Rating This Month
        </h3>
        <h2 className="bg-green-600/20 text-green-500 text-sm px-4 h-fit w-fit rounded-2xl">
          {data.length}
        </h2>
      </div>
      <button
        onClick={() => router.push("/volunteer/myRatingHistory")}
        className="text-xs absolute right-2 top-5 cursor-pointer flex gap-1 items-center justify-center transition-all duration-300 ease-out hover:text-blue-400 text-blue-200"
      >
        View All <IoIosArrowForward />
      </button>
      {isLoading ? (
        <div className="flex w-full animate-pulse text-white bg-gray-700  items-center  rounded-lg shadow-lg p-2 justify-center">
          <ImSpinner9 className="animate-spin" size={20} />
        </div>
      ) : data.length > 0 ? (
        data.map((rating) => (
          <RatingCardVolunteer
            key={rating.id}
            item={rating}
            isOpenId={isOpenId}
            setIsOpenId={setIsOpenId}
          />
        ))
      ) : (
        <h3 className="flex w-full items-center justify-center text-gray-300">
          You don`t have rating records this month
        </h3>
      )}
    </div>
  );
}

export default RatingThisMonth;
