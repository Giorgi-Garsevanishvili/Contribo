import { useCompAlert } from "@/hooks/useCompAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
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

type DataAddObj = {
  positionId: string;
  startedAt: string;
  endedAt: string | null;
  ended: boolean;
};

export const DataAddObj = {
  positionId: "",
  startedAt: "",
  ended: false,
} as DataAddObj;

type Props = { onCreated: () => void };

function PositionHistoryCreate({ onCreated }: Props) {
  const [data, setData] = useState<Data>();
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const userId = params.userId;

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const [createData, setCreateData] = useState(DataAddObj);

  const createCase = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (createData.positionId === "" || createData.startedAt === "") {
        setIsLoading(false);
        return triggerCompAlertRef.current({
          message: `All fields with * should be filled `,
          type: "error",
          isOpened: true,
        });
      }

      if (createData.ended === true && createData.endedAt === null) {
        setIsLoading(false);
        return triggerCompAlertRef.current({
          message: `If Position Mandate Ended Provide End Date.`,
          type: "error",
          isOpened: true,
        });
      }

      const payload = {
        ...createData,
        startedAt: new Date(createData.startedAt),
        endedAt: createData.endedAt ? new Date(createData.endedAt) : null,
      };

      if (
        createData.startedAt &&
        createData.endedAt &&
        createData.endedAt < createData.startedAt
      ) {
        setIsLoading(false);
        return triggerCompAlertRef.current({
          message: "End date cannot be earlier than start date",
          type: "error",
          isOpened: true,
        });
      }

      if (createData.ended === true && !createData.endedAt) {
        setIsLoading(false);
        return triggerCompAlertRef.current({
          message: "End date is required when marking as ended",
          type: "error",
          isOpened: true,
        });
      }

      await axios.post(`/api/admin/users/${userId}/positionHistory`, payload);

      setIsLoading(false);
      setCreateData(DataAddObj);
      triggerCompAlertRef.current({
        message: `Position History Created`,
        type: "success",
        isOpened: true,
      });
      onCreated();
    } catch (error) {
      const message = getClientErrorMessage(error);
      setIsLoading(false);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });
    }
    return;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/positions`);

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
            <div className="flex md:flex-row flex-col  text-gray-500">
              <div className="flex flex-col flex-grow">
                <label className="ml-3" htmlFor="start">
                  Start Date <strong className="text-red-500">*</strong>
                </label>
                <input
                  value={createData.startedAt}
                  onChange={(e) =>
                    setCreateData((prev) => ({
                      ...prev,
                      startedAt: e.target.value,
                    }))
                  }
                  className="input-def  bg-gray-400/95 border-white text-white rounded-sm flex-grow"
                  type="datetime-local"
                  name="start"
                  id="start"
                  placeholder="Start Date"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <label className="ml-3" htmlFor="end">
                  End Date
                </label>
                <input
                  value={createData.endedAt ? createData.endedAt : ""}
                  onChange={(e) =>
                    setCreateData((prev) => ({
                      ...prev,
                      endedAt: e.target.value,
                    }))
                  }
                  className="input-def  bg-gray-400/95 border-white text-white rounded-sm flex-grow"
                  type="datetime-local"
                  name="end"
                  id="end"
                  placeholder="End Date"
                />
              </div>
            </div>

            <div className="flex flex-grow">
              <select
                value={createData.positionId}
                onChange={(e) =>
                  setCreateData((prev) => ({
                    ...prev,
                    positionId: e.target.value,
                  }))
                }
                className="flex-grow border-2 m-1 rounded-md p-1.5  bg-gray-400/95 text-white"
                name="position"
                id="position"
              >
                <option value={""}>Position</option>
                {data?.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
              <label htmlFor="position">
                <strong className="text-red-500">*</strong>
              </label>

              <label className="inline-flex m-4 items-center cursor-pointer">
                <span className="select-none text-sm font-medium text-heading">
                  Present
                </span>
                <input
                  onChange={(e) =>
                    setCreateData((prev) => ({
                      ...prev,
                      ended: e.target.checked,
                    }))
                  }
                  type="checkbox"
                  checked={createData.ended}
                  className="sr-only peer"
                />
                <div className="relative mx-2 w-11 h-6 bg-neutral-400 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-brand-soft dark:peer-focus:ring-gray-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[1px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800"></div>
                <span className="select-none text-sm font-medium text-heading">
                  Ended
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="btn flex-grow bg-[#48765b] text-white"
            >
              Create
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PositionHistoryCreate;
