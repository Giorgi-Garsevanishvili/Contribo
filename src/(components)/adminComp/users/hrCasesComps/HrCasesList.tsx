import { HrWarningStatus } from "@/generated/enums";
import { useFetchData } from "@/hooks/useDataFetch";

import { ParamValue } from "next/dist/server/request/params";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";

type Data = {
  id: string;
  name: string;
  status: string;
  comment: string;
  updatedAt: string | null;
  createdAt: string | null;
  createdBy: { name: string } | null;
  updatedBy: { name: string } | null;
  type: { name: string };
  assignee: {
    name: string;
  };
};

export const CasUpdateObj = {
  name: "",
  comment: "",
  status: "",
  typeId: "",
};

function HrCasesList({ id }: { id: ParamValue }) {
  const [isOpenId, setIsOpenId] = useState("");
  const [onEdit, setOnEdit] = useState("");
  const { data, isLoadingFetch } = useFetchData<Data[]>(
    `/api/admin/users/${id}/hrWarning`,
    [],
  );

  const { data: types, isLoadingFetch: isLoadingFetch2 } = useFetchData<Data[]>(
    `/api/admin/hrWarningTypes`,
    [],
  );

  return (
    <div
      className={`flex w-full items-center justify-center px-25 py-5 flex-col`}
    >
      {isLoadingFetch ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold animate-spin">.</h3>
        </div>
      ) : (
        data?.map((item) => (
          <div
            className="flex flex-col transition-all duration-300 shadow-sm rounded-2xl m-1 p-0 justify-between w-full bg-gray-100/85"
            key={item.id}
          >
            <button
              onClick={() => (
                setIsOpenId(() => (isOpenId !== item.id ? item.id : "")),
                setOnEdit("")
              )}
              className=" flex lg:flex-row flex-col px-5 py-1.5 text-sm btn justify-between transition-all duration-300 w-full m-0 bg-gray-300/85 shadow-md mb-2"
            >
              <h3>
                <strong>Assignee: </strong> {item.assignee.name}
              </h3>
              <h3>
                <strong>Case: </strong> {item.name}
              </h3>
              <h3>
                <strong>Status: </strong> {item.status}
              </h3>
              <h3>
                <strong>Type: </strong>
                {item.type.name}
              </h3>
              {isOpenId === item.id ? (
                <FaAngleUp className="animate-pulse" size={22} />
              ) : (
                <FaAngleDown className="animate-pulse" size={22} />
              )}
            </button>
            <div
              className={`${isOpenId === item.id ? "flex" : "hidden"} lg:flex-row flex-col w-full items-center justify-center`}
            >
              <div className="flex  lg:flex-row flex-col w-full items-center justify-start p-3">
                <div className="flex flex-grow  bg-gray-100/70 rounded-lg lg:flex-row flex-col items-center justify-center py-10 px-10 m-2 gap-5">
                  <div className="flex-col flex">
                    <h3>
                      <strong>Name: </strong>
                      {item.name}
                    </h3>
                    <h3>
                      <strong>Type: </strong>
                      {item.type.name}
                    </h3>
                    <h3>
                      <strong>Created At: </strong>
                      {item.createdAt}
                    </h3>
                    <h3>
                      <strong>Updated At: </strong>
                      {item.updatedAt ?? "No Data"}
                    </h3>
                  </div>
                  <div className="flex-col flex lg:flex-1">
                    <h3>
                      <strong>Status: </strong>
                      {item.status}
                    </h3>
                    <h3>
                      <strong>Comment: </strong>
                      {item.comment}
                    </h3>
                    <h3>
                      <strong>Created By: </strong>
                      {item.createdBy?.name ?? "No Data"}
                    </h3>
                    <h3>
                      <strong>Updated By: </strong>
                      {item.updatedBy?.name ?? "No Data"}
                    </h3>
                  </div>
                </div>
                <div
                  className={`${onEdit === item.id ? "flex" : "hidden"} bg-gray-100/70 p-4 rounded-lg mx-2 flex-col lg:flex-row flex-grow items-center justify-between`}
                >
                  <div className="flex flex-col">
                    <div>
                      <input
                        value={item.name}
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
                        value={item.type.name}
                        className="flex-grow border-2 m-1 rounded-md p-1.5  bg-gray-400/95 text-white"
                        name="type"
                        id="type"
                      >
                        {types?.map((type) => (
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
                        value={item.status}
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
                  </div>
                  <div className="flex flex-col flex-grow  bg-gray-400/95 p-2 m-2 rounded-lg">
                    <div className="flex flex-col  text-white flex-grow">
                      <label className="px-3 flex" htmlFor="comment">
                        Comment <strong className="text-red-500 ml-2">*</strong>
                        <h2 className="italic ml-2 text-gray-300">
                          Max: 150 word
                        </h2>
                      </label>
                      <input
                        value={item.comment}
                        className="input-def  break-words text-wrap rounded-sm flex-grow border-white"
                        type="text"
                        maxLength={150}
                        name="comment"
                        id="comment"
                        placeholder="Comment"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex  m-4 lg:flex-col">
                <button className="btn flex-grow">Delete</button>

                <button
                  className={`btn ${onEdit === item.id ? "flex" : "hidden"}`}
                >
                  Update
                </button>

                <button
                  onClick={() => {
                    setOnEdit(onEdit === item.id ? "" : isOpenId);
                  }}
                  className={`btn flex-grow`}
                >
                  {onEdit === item.id ? "Close" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HrCasesList;
