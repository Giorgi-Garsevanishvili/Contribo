import { useCompAlert } from "@/hooks/useCompAlert";
import { HrWarningStatus } from "@prisma/client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { FormEvent, useEffect, useRef, useState } from "react";

type Data = {
  createdAt: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}[];

export const CaseAddObj = {
  name: "",
  comment: "",
  status: "",
  typeId: "",
};

type Props = { onCreated: () => void };

function HRCaseCreate({ onCreated }: Props) {
  const [data, setData] = useState<Data>();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const userId = params.userId;
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const [createData, setCreateData] = useState(CaseAddObj);

  const createCase = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (
        createData.name === "" ||
        createData.status === "" ||
        createData.typeId === "" ||
        createData.comment === ""
      ) {
        setIsLoading(false);
        return triggerCompAlertRef.current({
          message: `All fields with * should be filled `,
          type: "error",
          isOpened: true,
        });
      }

      await axios.post(`/api/admin/users/${userId}/hrWarning`, createData);

      setIsLoading(false);
      setCreateData(CaseAddObj);
      triggerCompAlertRef.current({
        message: `HR Case Created`,
        type: "success",
        isOpened: true,
      });
      onCreated();
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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/hrWarningTypes`);

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
    <div className="flex p-5 w-full">
      {isLoading ? (
        <h2 className="animate-pulse">Loading...</h2>
      ) : (
        <form
          onSubmit={(e) => createCase(e)}
          className="flex-col md:flex-row flex justify-between w-full"
        >
          <div className="flex flex-col flex-grow">
            <div className="flex flex-grow">
              <input
                value={createData.name}
                onChange={(e) =>
                  setCreateData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input-def  bg-gray-400/95 border-white text-white rounded-sm flex-grow"
                type="text"
                name="name"
                id="name"
                placeholder="Name"
              />
              <label htmlFor="name">
                <strong className="text-red-500">*</strong>
              </label>
            </div>
            <div className="flex flex-grow">
              <select
                value={createData.typeId}
                onChange={(e) =>
                  setCreateData((prev) => ({ ...prev, typeId: e.target.value }))
                }
                className="flex-grow border-2 m-1 rounded-md p-1.5  bg-gray-400/95 text-white"
                name="type"
                id="type"
              >
                <option value={""}>Type</option>
                {data?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <label htmlFor="type">
                <strong className="text-red-500">*</strong>
              </label>
            </div>
            <div className="flex flex-grow">
              <select
                value={createData.status}
                onChange={(e) =>
                  setCreateData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="flex-grow border-2 m-1 rounded-md p-1.5 bg-gray-400/95 text-white"
                name="status"
                id="status"
              >
                <option value={""}>Status</option>
                {Object.values(HrWarningStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <label htmlFor="status">
                <strong className="text-red-500">*</strong>
              </label>
            </div>

            <button
              type="submit"
              className="btn flex-grow bg-[#48765b] text-white"
            >
              Create
            </button>
          </div>
          <div className="flex flex-col flex-grow  bg-gray-400/95 p-2 m-2 rounded-lg">
            <div className="flex flex-col  text-white flex-grow">
              <label className="px-3 flex" htmlFor="comment">
                Comment <strong className="text-red-500 ml-2">*</strong>
                <h2 className="italic ml-2 text-gray-300">Max: 150 word</h2>
              </label>
              <input
                value={createData.comment}
                onChange={(e) =>
                  setCreateData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                className="input-def break-words text-wrap rounded-sm flex-grow border-white"
                type="text"
                maxLength={150}
                name="comment"
                id="comment"
                placeholder="Comment"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default HRCaseCreate;
