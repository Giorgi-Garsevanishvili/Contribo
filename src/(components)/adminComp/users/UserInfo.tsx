"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoTime } from "react-icons/io5";
import { MdCardMembership } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { FaUserEdit } from "react-icons/fa";
import { MdFolderDelete } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import AccessData from "./AccessData";
import { MdBadge } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { useFetchData } from "@/hooks/useDataFetch";
import UserUpdate from "./UserUpdate";
import { useDeleteData } from "@/hooks/useDeleteData";
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

function UserInfo({
  openData,
  refetchKey,
}: {
  openData: boolean;
  refetchKey: number;
}) {
  const params = useParams();
  const id = params.userId;

  const route = useRouter();
  const [open, setOpen] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openUserUpdate, setOpenUserUpdate] = useState(false);

  const { data, isLoadingFetch, refetch, success } = useFetchData<Data>(
    `/api/admin/users/${id}`,
    [],
  );
  const { deleteData: DeleteSoft, isLoadingDelete: softdeleteLoading } =
    useDeleteData(
      `/api/admin/users/${id}/softdelete`,
      "Would You Like To Soft Delete",
      `${data?.name}`,
      "Action Is Permanent! User Identification Data will delete and access won`t be available for this user. current user activities will stay for internal statistical purposes without direct or indirect Identification of the owner of user. Later you can create new account for current user but this account data won`t be link anyhow to new user.",
      refetch,
    );

  const { deleteData: DeleteFull, isLoadingDelete: fullDeleteLoading } =
    useDeleteData(
      `/api/admin/users/${id}`,
      "Would You Like To Delete",
      `${data?.name}`,
      "Action Is Permanent! All Information and data related to user will be deleted",
      refetch,
    );

  useEffect(() => {
    setOpenUserUpdate(false);
  }, [success]);

  useEffect(() => {
    refetch();
  }, [refetchKey]);

  return (
    <div className="flex flex-col w-full justify-center items-center">
      {
        <div className="flex md:flex-row flex-col m-2 justify-center items-center">
          <div
            className={`${isLoadingFetch || softdeleteLoading || fullDeleteLoading ? "animate-pulse transition-all duration-300" : ""} select-none flex p-2 items-center justify-center bg-gray-200/60 rounded-lg shadow-lg`}
          >
            {data ? (
              <div className="flex flex-col md:flex-row items-center justify-center">
                <div className="flex w-38 h-38 m-1">
                  {data && data.image ? (
                    <Image
                      priority
                      className="rounded-2xl shadow-sm"
                      src={data?.image}
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
                  className={`flex flex-col p-4 m-1 justify-start bg-gray-200/60 rounded-lg shadow-sm`}
                >
                  <div
                    className={`${openUserUpdate ? "flex flex-col justify-center items-center" : "hidden"}`}
                  >
                    <UserUpdate id={id} refetch={refetch} />
                  </div>
                  <div className={`${openUserUpdate ? "hidden" : ""}`}>
                    <h2 className="flex items-center">
                      <FaUser className="mr-2" size={22} />{" "}
                      <span className="truncate">
                        {data.name.length > 30
                          ? `${data.name.slice(0, 30)}...`
                          : data.name}
                      </span>
                    </h2>
                    <h2 className="flex items-center">
                      <MdEmail className="mr-2" size={22} />{" "}
                      <span className="truncate">
                        {data.email.length > 30
                          ? `${data.email.slice(0, 30)}...`
                          : data.email}
                      </span>
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
                <div className="flex flex-col w-full md:w-fit ">
                  <button
                    onClick={() => setOpenUserUpdate(!openUserUpdate)}
                    className={`flex ${openUserUpdate ? "bg-red-900/85 text-white" : "bg-gray-300/70"} btn  active:bg-blue-900/60 active:text-white active:opacity-50
    focus-visible:bg-blue-900/60 focus-visible:text-white  hover:bg-blue-900 hover:text-white hover:opacity-100 duration-300 transition-all `}
                  >
                    {openUserUpdate ? (
                      <IoIosCloseCircle className="mr-2 text-white" size={22} />
                    ) : (
                      <FaUserEdit className="mr-2" size={22} />
                    )}
                    {openUserUpdate ? "Close" : "Edit User"}
                  </button>
                  <button
                    onClick={DeleteSoft}
                    className="flex btn  active:bg-orange-400/60 active:text-white active:opacity-50
    focus-visible:bg-orange-400/60 focus-visible:text-white hover:bg-orange-400/60 hover:text-white hover:opacity-100 duration-300 transition-all bg-gray-300/70"
                  >
                    <MdFolderDelete className="mr-2" size={22} /> Soft Delete
                  </button>
                  <button
                    onClick={DeleteFull}
                    className="flex btn  active:bg-red-700/60 active:text-white active:opacity-50
    focus-visible:bg-red-700/60 focus-visible:text-white hover:bg-red-700/60 hover:text-white hover:opacity-100 duration-300 transition-all bg-gray-300/70"
                  >
                    <MdDelete className="mr-2" size={22} /> Full Delete
                  </button>
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
          <div
            className={`${openData ? "flex" : "hidden"} md:flex  m-2 ${isLoadingFetch || softdeleteLoading || fullDeleteLoading ? " p-2 bg-gray-200/60 rounded-lg shadow-lg" : ""}`}
          >
            {data ? (
              <AccessData
                refetchKey={isLoadingFetch}
                id={data?.ownAllowance.id}
              ></AccessData>
            ) : (
              <div
                className={`flex flex-col justify-center items-center w-40 p-10 h-25}`}
              >
                <h3 className="mb-4">Access Info</h3>
                <ImSpinner9 className="animate-spin" size={25} />
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
}
export default UserInfo;
