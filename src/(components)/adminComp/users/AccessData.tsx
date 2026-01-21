"use client";
import { useCompAlert } from "@/hooks/useCompAlert";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


type Data = {};
//probably will pass ownAllowance Id from User data
function AccessData({id}:{id: string | undefined}) {

  
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data>();
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);


  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/allowedUsers/${id}`);

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
    <div className="flex justify-center items-center">
      {
        <div className="flex flex-col justify-center items-center">
          {" "}
          <div
            className={`${isLoading ? "animate-pulse transition-all duration-300" : ""} select-none flex p-2 items-center justify-center bg-gray-200/60 rounded-lg shadow-lg`}
          >

          </div>
        </div>
      }
    </div>
  );
}
export default AccessData;
