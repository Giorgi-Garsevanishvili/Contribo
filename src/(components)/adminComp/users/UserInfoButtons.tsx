"use client";
import { useCompAlert } from "@/hooks/useCompAlert";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons/lib";

type Data = {
  id: string;
  status: string;
  name: string;
  type: { name: string };
  assignee: { name: string };
}[];

type Props = { APIPath: string; title: string; Icon: IconType, URLPath:string };

function UserInfoButtons({ APIPath, title, Icon, URLPath }: Props) {
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data>();
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/admin/users/${params.userId}/${APIPath}`,
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
    <>
      {data ? (
        <>
          <button
            onClick={() => router.push(`/admin/${URLPath}/${params.userId}`)}
            className="btn w-full md:w-auto bg-gray-300/85 hover:ring-2 ring-white "
          >
            <Icon size={23} className="m-2" /> {title}: {data.length}
          </button>
        </>
      ) : (
        <div
          className={`flex ${isLoading ? "animate-pulse transition-all duration-300" : ""} flex-col rounded-md bg-gray-300/65 justify-center items-center w-45 p-3 m-1 h-10}`}
        >
          <h3 className="mb-2">{title}</h3>
          <h3>Loading...</h3>
        </div>
      )}
    </>
  );
}
export default UserInfoButtons;
