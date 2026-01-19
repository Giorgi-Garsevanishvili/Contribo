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
  }[];
  name: string;
  ownAllowance: {
    createdAt: string;
    creatorId: string;
    email: string;
    id: string;
    regionId: string;
    type: string;
    updatedAt: string;
    userId: string | null;
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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/users/${params.userId}`);

      setData(response.data.data);

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
    <div className="flex flex-col w-screen justify-center items-center">
      {
        <>
          <button
            className="flex items-center border-1 justify-center btn p-2 text-center font-bold rounded-tr-md rounded-bl-md text-m bg-blue-950/70 text-white"
            onClick={() => route.back()}
          >
            <IoMdArrowRoundBack size={25} />
          </button>
          <div
            className={`${isLoading ? "animate-pulse transition-all duration-300" : ""} flex flex-row p-2 items-center justify-center bg-gray-200/60 rounded-lg shadow-lg`}
          >
            {data ? (
              <>
                <div className="flex w-38 h-38">
                  {data ? (
                    <Image
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
                <div className="flex flex-col ml-2 p-4 justify-start bg-gray-200/60 rounded-lg shadow-sm">
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
                    <MdCardMembership className="mr-2" size={22} />
                    <strong className="mr-2">Status:</strong>{" "}
                    {`${
                      data.memberStatusLogs[data.memberStatusLogs.length - 1]
                        ?.status?.name ?? "No Status"
                    }`}
                  </h2>
                  <h2 className="flex items-center">
                    <FaStar className="mr-2" size={22} />{" "}
                    <strong className="mr-2">Rating:</strong> {data.rating}
                  </h2>
                </div>
              </>
            ) : (
              <h3
                className={`flex w-40 p-10 h-25 ${isLoading ? "animate-spin transition-all duration-300" : ""}`}
              >
                .
              </h3>
            )}
          </div>
        </>
      }
    </div>
  );
}
export default UserInfo;
