import { useCompAlert } from "@/hooks/useCompAlert";
import { useFetchData } from "@/hooks/useDataFetch";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { FormEvent, useRef, useState } from "react";

type Data = {
  createdAt: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}[];

type DataAddObj = {
  memberStatusId: string;
  startedAt: string;
  endedAt: string | null;
  ended: boolean;
};

export const DataAddObj = {
  memberStatusId: "",
  startedAt: "",
  ended: false,
} as DataAddObj;

type Props = { onCreated: () => void };

function MemberStatusLogCreate({ onCreated }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const userId = params.userId;

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const [createData, setCreateData] = useState(DataAddObj);

  const createCase = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (createData.memberStatusId === "" || createData.startedAt === "") {
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
          message: `If Member Status Ended Provide End Date.`,
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

      await axios.post(`/api/admin/users/${userId}/memberStatusLog`, payload);

      setIsLoading(false);
      setCreateData(DataAddObj);
      triggerCompAlertRef.current({
        message: `Member Status Log Created`,
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

  const { data, isLoadingFetch } = useFetchData<Data>(
    `/api/admin/memberStatus`,
    [],
  );

  return (
    <div className="flex p-5 w-full">
      {isLoading || isLoadingFetch ? (
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
                value={createData.memberStatusId}
                onChange={(e) =>
                  setCreateData((prev) => ({
                    ...prev,
                    memberStatusId: e.target.value,
                  }))
                }
                className="flex-grow border-2 m-1 rounded-md p-1.5  bg-gray-400/95 text-white"
                name="type"
                id="type"
              >
                <option value={""}>Status</option>
                {data?.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
              <label htmlFor="type">
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
              disabled={isLoading}
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

export default MemberStatusLogCreate;
