"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoTime } from "react-icons/io5";
import { MdCardMembership } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { FaUserEdit } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdBadge } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { useFetchData } from "@/hooks/useDataFetch";
import { FcDeleteDatabase } from "react-icons/fc";
import { ImSpinner9 } from "react-icons/im";

type Data = {
  CreatedAllowedUser: [];
  allowedUserId: string;
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  email: string;
  emailVerified: boolean | null;
  eventAssignments: [];
  hrWarnings: [
    {
      id: string;
      name: string;
      assigneeId: string;
      comment: string | null;
      createdAt: string;
      createdById: string;
      status: string;
      typeId: string;
      updatedAt: string | null;
      updatedById: string | null;
    } | null,
  ];
  id: string;
  image: string;
  memberStatusLogs: {
    status: {
      name: string;
    } | null;
    updatedBy: {
      name: string;
    } | null;
    createdBy: {
      name: string;
    } | null;
    updatedAt: string;
    createdAt: string;
  }[];
  name: string;
  ownAllowance: {
    id: string;
  };
  positionHistories: {
    position: { name: string };
    ended: boolean;
    createdAt: string;
    createdBy: { name: string };
    startedAt: string;
  }[];
  providedFeedbacks: [];
  rating: number;
  ratingHistory: [];
  reqStatus: string;
  updatedAt: string;
  updatedBy: {
    name: string;
  } | null;
};

function UserInfoVolunteer() {
  const params = useParams();
  const id = params.userId;

  const [open, setOpen] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openUserUpdate, setOpenUserUpdate] = useState(false);

  const { data, isLoadingFetch, refetch, success } = useFetchData<Data>(
    `/api/user/myProfile`,
    [],
  );

  useEffect(() => {
    setOpenUserUpdate(false);
  }, [success]);

  const getHighResImage = (url: string) => {
    if (url.includes("googleusercontent.com")) {
      return url.replace(/=s\d+-c/, "=s300-c");
    }
    if (url.includes("avatars.githubusercontent.com")) {
      return `${url.split("?")[0]}?size=300`;
    }
    return url;
  };

  return (
    <div className="flex flex-col w-full justify-center items-center">
      {
        <div className="flex md:flex-row w-full flex-col m-2 justify-center items-center">
          <div
            className={`${isLoadingFetch ? "animate-pulse transition-all duration-300" : ""} select-none flex p-2 items-center justify-center bg-gray-200/60 w-full rounded-lg shadow-lg`}
          >
            {data ? (
              <div className="flex flex-col md:flex-row w-full items-center justify-center">
                <div className="flex w-52 rounded-md h-auto m-1">
                  {data && data.image ? (
                    <Image
                      priority
                      className="rounded-md shadow-sm"
                      src={getHighResImage(data.image)}
                      alt="User Photo"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <FcDeleteDatabase className="mr-2" size={60} />
                    </div>
                  )}
                </div>
                <div
                  className={`grid flex-col p-4 m-1 grow  justify-start bg-gray-200/60 rounded-lg shadow-sm`}
                >
                  <div className={`${openUserUpdate ? "hidden" : ""} min-w-0`}>
                    <h2 className="flex items-center">
                      <FaUser className="mr-2" size={22} />{" "}
                      <span className="truncate">{data.name}</span>
                    </h2>
                    <h2 className="flex items-center">
                      <MdEmail className="mr-2" size={22} />{" "}
                      <span className="truncate">{data.email}</span>
                    </h2>
                    <h2 className="flex items-center">
                      <IoTime className="mr-2" size={22} />
                      <strong className="mr-2">Since:</strong>{" "}
                      {new Date(data.createdAt).toDateString()}
                    </h2>
                    <h2 className="flex items-center">
                      <HiWrenchScrewdriver className="mr-2" size={22} />
                      <strong className="mr-2">Last Update:</strong>{" "}
                      {new Date(data.updatedAt).toDateString()}
                      <button
                        onMouseEnter={() => setOpenUpdate(true)}
                        onMouseLeave={() => setOpenUpdate(false)}
                        onClick={() => setOpen(!open)}
                        className="ml-2 cursor-pointer text-gray-500"
                      >
                        <IoMdInformationCircleOutline size={22} />
                        {openUpdate && (
                          <div
                            className="absolute z-50 w-auto rounded-md bg-gray-900/85 text-white text-xs p-2 shadow-lg
                        left-1/2 -translate-x-1/2 mt-2"
                          >
                            <div className="flex flex-col justify-center items-start p-1">
                              <h2 className="p-0.5">
                                {`Updated By: ${
                                  data.updatedBy?.name ?? "No Data"
                                }`}
                              </h2>
                            </div>
                          </div>
                        )}
                      </button>
                    </h2>
                    <h2 className="flex items-center">
                      <MdCardMembership className="mr-2" size={22} />
                      <strong className="mr-2">Status:</strong>{" "}
                      {`${
                        data.memberStatusLogs[data.memberStatusLogs.length - 1]
                          ?.status?.name ?? "No Status"
                      }`}
                      <button
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}
                        onClick={() => setOpen(!open)}
                        className="ml-2 cursor-pointer text-gray-500"
                      >
                        <IoMdInformationCircleOutline size={22} />
                        {open && (
                          <div
                            className="absolute z-50 w-auto rounded-md bg-gray-900/85 text-white text-xs p-2 shadow-lg
                        left-1/2 -translate-x-1/2 mt-2"
                          >
                            <div className="flex flex-col justify-center items-start p-1">
                              <h2 className="p-0.5">
                                {`Created By: ${
                                  data.memberStatusLogs[
                                    data.memberStatusLogs.length - 1
                                  ]?.createdBy?.name ?? "No Data"
                                }`}
                              </h2>
                              <h2 className="p-0.5">
                                {`Created At: ${new Date(
                                  data.memberStatusLogs[
                                    data.memberStatusLogs.length - 1
                                  ]?.createdAt,
                                ).toLocaleString()}`}
                              </h2>
                            </div>
                          </div>
                        )}
                      </button>
                    </h2>
                    <h2 className="flex items-center">
                      <MdBadge className="mr-2" size={22} />
                      <strong className="mr-2">Position:</strong>{" "}
                      {`${
                        data.positionHistories[
                          data.positionHistories.length - 1
                        ]?.position?.name ?? "No Data"
                      }`}
                      <button
                        onMouseEnter={() => setOpenPosition(true)}
                        onMouseLeave={() => setOpenPosition(false)}
                        onClick={() => setOpenPosition(!open)}
                        className="ml-2 cursor-pointer text-gray-500"
                      >
                        <IoMdInformationCircleOutline size={22} />
                        {openPosition && (
                          <div
                            className="absolute z-50 w-auto rounded-md bg-gray-900/85 text-white text-xs p-2 shadow-lg
                        left-1/2 -translate-x-1/2 mt-2"
                          >
                            <div className="flex flex-col justify-center items-start p-1">
                              <h2 className="p-0.5">
                                {`Created By: ${
                                  data.positionHistories[
                                    data.positionHistories.length - 1
                                  ]?.createdBy?.name ?? "No Data"
                                }`}
                              </h2>
                              <h2 className="p-0.5">
                                {`Created At: ${new Date(
                                  data.positionHistories[
                                    data.positionHistories.length - 1
                                  ]?.createdAt,
                                ).toLocaleString()}`}
                              </h2>
                              <h2 className="p-0.5">
                                {`Started At: ${new Date(
                                  data.positionHistories[
                                    data.positionHistories.length - 1
                                  ]?.startedAt,
                                ).toLocaleString()}`}
                              </h2>
                              <h2 className="p-0.5">
                                {`Active: ${
                                  data.positionHistories[
                                    data.positionHistories.length - 1
                                  ]?.ended === false
                                    ? "✅"
                                    : "❌"
                                }
                            `}
                              </h2>
                            </div>
                          </div>
                        )}
                      </button>
                    </h2>
                    <h2 className="flex mt-1 items-center">
                      <FaStar className="mr-2" size={22} />{" "}
                      <strong className="mr-2">Rating:</strong>{" "}
                      {
                        <div
                          className={`border-2 px-2 rounded-lg ${data.rating > 40 && data.rating <= 80 ? "border-yellow-700 text-yellow-700" : data.rating > 80 ? "border-green-700 text-green-700" : "border-pink-700 text-pink-700"}`}
                        >
                          {data.rating}
                        </div>
                      }
                    </h2>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`flex flex-col justify-center items-center w-40 p-10 h-25}`}
              >
                <h3 className="mb-4">User Info</h3>
                <ImSpinner9 className="animate-spin" size={25} />
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
}
export default UserInfoVolunteer;
