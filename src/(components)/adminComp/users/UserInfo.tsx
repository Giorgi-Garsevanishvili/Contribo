"use client";
import { useCompAlert } from "@/hooks/useCompAlert";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

type Data = {
  CreatedAllowedUser: [];
  allowedUserId: string;
  createdAt: Date;
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
  }[];
  name: string;
  ownAllowance: {
    id: string;
  };
  positionHistories: [];
  providedFeedbacks: [];
  rating: number;
  ratingHistory: [];
  reqStatus: string;
  updatedAt: string;
};

function UserInfo() {
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data>();
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const route = useRouter();
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/users/${params.userId}`);

      setData(response.data.data);
      console.log(response.data.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      triggerCompAlertRef.current({
        message: `${error}`,
        type: "error",
        isOpened: true,
      });
    }
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex w-screen justify-center items-center">
      {
        <div className="flex flex-col justify-center items-center">
          <button
            className="flex items-center border-1 justify-center btn p-2 text-center font-bold rounded-tr-md rounded-bl-md text-m bg-blue-950/70 text-white"
            onClick={() => route.back()}
          >
            <IoMdArrowRoundBack size={25} />
          </button>
          <div
            className={`${isLoading ? "animate-pulse transition-all duration-300" : ""} select-none flex p-2 items-center justify-center bg-gray-200/60 rounded-lg shadow-lg`}
          >
            {data ? (
              <div className="flex flex-col md:flex-row items-center justify-center">
                <div className="flex w-38 h-38 m-1">
                  {data ? (
                    <Image
                      priority
                      className="rounded-2xl shadow-sm"
                      src={data?.image}
                      alt="User Photo"
                      width={300}
                      height={300}
                    />
                  ) : (
                    "No Image To Display"
                  )}
                </div>
                <div className="flex flex-col p-4 m-1 justify-start bg-gray-200/60 rounded-lg shadow-sm">
                  <h2 className="flex items-center">
                    <FaUser className="mr-2" size={22} /> {data.name}
                  </h2>
                  <h2 className="flex items-center">
                    <MdEmail className="mr-2" size={22} /> {data.email}
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
                                ]?.createdBy?.name ?? "Unknown User"
                              }`}
                            </h2>
                            <h2 className="p-0.5">
                              {`Updated At: ${new Date(
                                data.memberStatusLogs[
                                  data.memberStatusLogs.length - 1
                                ]?.updatedAt,
                              ).toLocaleString()}`}
                            </h2>
                            <h2 className="p-0.5">
                              {`Updated By: ${
                                data.memberStatusLogs[
                                  data.memberStatusLogs.length - 1
                                ]?.updatedBy?.name ?? "Unknown User"
                              }`}
                            </h2>
                          </div>
                        </div>
                      )}
                    </button>
                  </h2>
                  <h2 className="flex items-center">
                    <FaStar className="mr-2" size={22} />{" "}
                    <strong className="mr-2">Rating:</strong>{" "}
                    {
                      <div
                        className={`border-2 px-1 rounded-lg ${data.rating > 40 ? "border-yellow-700 text-yellow-700" : data.rating > 80 ? "border-green-700 text-green-700" : "border-pink-700 text-pink-700"}`}
                      >
                        {data.rating}
                      </div>
                    }
                  </h2>
                </div>
                <div className="flex flex-col w-full md:w-fit ">
                  <button
                    className="flex btn  active:bg-blue-900/60 active:text-white active:opacity-50
    focus-visible:bg-blue-900/60 focus-visible:text-white hover:bg-blue-900 hover:text-white hover:opacity-100 duration-300 transition-all bg-gray-300/70"
                  >
                    <FaUserEdit className="mr-2" size={22} /> Edit User
                  </button>
                  <button
                    className="flex btn  active:bg-orange-400/60 active:text-white active:opacity-50
    focus-visible:bg-orange-400/60 focus-visible:text-white hover:bg-orange-400/60 hover:text-white hover:opacity-100 duration-300 transition-all bg-gray-300/70"
                  >
                    <MdFolderDelete className="mr-2" size={22} /> Soft Delete
                  </button>
                  <button
                    className="flex btn  active:bg-red-700/60 active:text-white active:opacity-50
    focus-visible:bg-red-700/60 focus-visible:text-white hover:bg-red-700/60 hover:text-white hover:opacity-100 duration-300 transition-all bg-gray-300/70"
                  >
                    <MdDelete className="mr-2" size={22} /> Full Delete
                  </button>
                </div>
              </div>
            ) : (
              <h3
                className={`flex w-40 p-10 h-25 ${isLoading ? "animate-spin transition-all duration-300" : ""}`}
              >
                .
              </h3>
            )}
          </div>
        </div>
      }
      <div>
        <AccessData id={data?.ownAllowance.id}></AccessData>
      </div>
    </div>
  );
}
export default UserInfo;
