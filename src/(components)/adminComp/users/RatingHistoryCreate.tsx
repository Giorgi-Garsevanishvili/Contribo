import { RatingAction } from "@/generated/enums";
import { useCompAlert } from "@/hooks/useCompAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { FormEvent, useRef, useState } from "react";

type DataAddObj = {
  newValue: number;
  action: RatingAction;
  reason: string;
};

export const DataAddObj = {
  newValue: 0,
  action: "INCREASE",
  reason: "",
} as DataAddObj;

type Props = { onCreated: () => void };

function RatingHistoryCreate({ onCreated }: Props) {
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

      if (createData.newValue === 0 || createData.reason === "") {
        setIsLoading(false);
        return triggerCompAlertRef.current({
          message: `All fields with * should be filled `,
          type: "error",
          isOpened: true,
        });
      }

      await axios.post(`/api/admin/users/${userId}/ratingHistory`, createData);

      setIsLoading(false);
      setCreateData(DataAddObj);
      triggerCompAlertRef.current({
        message: `Rating History Created`,
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
              <div className="flex flex-col flex-grow  bg-gray-400/95 p-2 m-2 rounded-lg text-white max-w-50">
                <label className="ml-3" htmlFor="score">
                  Score <strong className="text-red-500">*</strong>
                </label>
                <input
                  value={createData.newValue}
                  onChange={(e) =>
                    setCreateData((prev) => ({
                      ...prev,
                      newValue: Number(e.target.value),
                    }))
                  }
                  className="input-def  bg-gray-400/95 border-white text-white rounded-sm flex-grow"
                  type="number"
                  name="score"
                  id="score"
                  placeholder="Score"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <label htmlFor="action">
                  <strong className="text-red-500">*</strong>
                </label>

                <label className="inline-flex m-4 items-center cursor-pointer">
                  <span className="select-none text-sm font-medium text-heading">
                    Decrease
                  </span>
                  <input
                    onChange={(e) =>
                      setCreateData((prev) => ({
                        ...prev,
                        action: e.target.checked ? "INCREASE" : "DECREASE",
                      }))
                    }
                    checked={createData.action === "INCREASE" ? true : false}
                    type="checkbox"
                    value={createData.action}
                    className="sr-only peer"
                  />
                  <div className="relative mx-2 w-11 h-6 bg-red-800 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-brand-soft dark:peer-focus:ring-gray-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[1px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800"></div>
                  <span className="select-none text-sm font-medium text-heading">
                    Increase
                  </span>
                </label>
              </div>
              <div className="flex flex-grow">
                <div className="flex flex-col flex-grow  bg-gray-400/95 p-2 m-2 rounded-lg">
                  <div className="flex flex-col  text-white flex-grow">
                    <label className="px-3 flex" htmlFor="reason">
                      Reason <strong className="text-red-500 ml-2">*</strong>
                      <h2 className="italic ml-2 text-gray-300">
                        Max: 150 word
                      </h2>
                    </label>
                    <input
                      value={createData.reason}
                      onChange={(e) =>
                        setCreateData((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      className="input-def break-words text-wrap rounded-sm flex-grow border-white"
                      type="text"
                      maxLength={150}
                      name="reason"
                      id="reason"
                      placeholder="Reason"
                    />
                  </div>
                </div>
              </div>
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

export default RatingHistoryCreate;
