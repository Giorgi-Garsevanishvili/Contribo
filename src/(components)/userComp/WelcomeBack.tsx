"use client";
import usePaginatedData from "@/hooks/usePaginatedData";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { useSession } from "next-auth/react";
import { BiSolidBookmarkHeart } from "react-icons/bi";
import { HrWarningStatus, RatingAction } from "@/generated/enums";
import MyHrStats from "./MyHrStats";

type UserStatsType = {
  updatedAt: Date | null;
  updatedBy: {
    name: string | null;
  } | null;
  _count: {
    providedFeedbacks: number;
  };
  name: string | null;
  image: string;
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

function WelcomeBack() {
  const { data: session } = useSession();

  const { data, isLoading, counts, refetch } = usePaginatedData<UserStatsType>(
    `/api/user/myProfile`,
    null,
  );

  const router = useRouter();

  return (
    <div className="flex md:flex-row h-fit flex-col md:w-[80%] grow w-full gap-2">
      <div
        className={`flex p-3 h-auto flex-col shrink-0 grow shadow items-center justify-center bg-gray-700/70 shadow-white text-white rounded-md gap-2`}
      >
        <div className="flex px-1 p-1 w-full md:flex-row flex-col relative items-center text-center justify-start gap-3">
          <BiSolidBookmarkHeart size={75}  />
          <div className="flex flex-col gap-1 items-center md:items-start justify-center">
            <h3 className=" cursor-default items-center justify-center leading-6 font-bold text-2xl text-blue-100">
              Welcome Back, {session?.user.name?.split(" ")[0]}! 👋
            </h3>
            <div className="flex flex-col items-center md:items-start justify-center">
              <p className="text-sm text-gray-50 leading-6">
                Thank you for being an amazing volunteer.
              </p>
              <p className="text-sm text-gray-50 leading-6">
                Here`s your activity overview
              </p>
            </div>
          </div>
        </div>
      </div>
      <MyHrStats userData={data} />
    </div>
  );
}

export default WelcomeBack;
