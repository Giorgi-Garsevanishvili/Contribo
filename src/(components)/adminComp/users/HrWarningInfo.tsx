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
  id: string;
  status: string;
  name: string;
  type: { name: string };
  assignee: { name: string };
}[];

function HrWarningInfo() {
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data>();
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const [openId, setOpenId] = useState<string | null>();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/admin/users/${params.userId}/hrWarning`,
      );

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
    <div
      className={`${isLoading ? "animate-pulse transition-all duration-300" : ""} select-none flex flex-col p-2 items-center justify-center bg-gray-200/60 rounded-lg shadow-lg`}
    >
      {data ? (
        <>
          <h2>All Cases: {data.length}</h2>
          {data.map((item) => (
            <div
              className={` flex flex-col w-full text-sm p-2 m-1 justify-start bg-gray-200/60 rounded-lg shadow-sm`}
              key={item.id}
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="flex p-1 w-full justify-between items-center"
              >
                <h2>{item.type.name}</h2>
                <h2>{item.status}</h2>
              </button>
              <div
                className={`${openId === item.id ? "flex flex-col" : "hidden"}`}
              >
                <h2>{item.name}</h2>
                <h2>{item.status}</h2>
                <h2>{item.type.name}</h2>
                <h2>{item.assignee.name}</h2>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div
          className={`flex flex-col justify-center items-center w-40 p-10 h-25}`}
        >
          <h3 className="mb-2">HR Cases</h3>
          <h3
            className={`${isLoading ? "animate-spin transition-all duration-300" : ""}`}
          >
            .
          </h3>
        </div>
      )}
    </div>
  );
}
export default HrWarningInfo;
