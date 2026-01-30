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

function HrCasesList({ id }: { id: ParamValue }) {
  const [isOpenId, setIsOpenId] = useState("");
  const [onEdit, setOnEdit] = useState("");
  const { data, isLoadingFetch, } = useFetchData<Data[]>(
    `/api/admin/users/${id}/hrWarning`,
    [],
  );

  return (
    <div
      className={`flex w-screen px-25 py-5 flex-col ${isLoadingFetch ? "animate-caret-blink" : ""}`}
    >
      {isLoadingFetch
        ? "Loading..."
        : data?.map((item) => (
            <div
              className="flex transition-all duration-300 flex-col shadow-sm rounded-2xl m-1 p-0 justify-between w-full bg-gray-100/85"
              key={item.id}
            >
              <button
                onClick={() => (
                  setIsOpenId(() => (isOpenId !== item.id ? item.id : "")),
                  setOnEdit("")
                )}
                className=" flex px-8 py-3 btn justify-between transition-all duration-300 w-full m-0 bg-gray-300/85 shadow-md mb-2"
              >
                <h3>Assignee: {item.assignee.name}</h3>
                <h3>Case: {item.name}</h3>
                <h3>Status: {item.status}</h3>
                <h3>Type: {item.type.name}</h3>
                {isOpenId === item.id ? (
                  <FaAngleUp className="animate-pulse" size={22} />
                ) : (
                  <FaAngleDown className="animate-pulse" size={22} />
                )}
              </button>
              <div
                className={`${isOpenId === item.id ? "flex" : "hidden"} w-full items-center justify-center`}
              >
                <div className="flex w-full items-center justify-between p-3">
                  <div className="grid grid-cols-2 gap-x-10 p-3">
                    <h3>
                      <strong>Name: </strong>
                      {item.name}
                    </h3>
                    <h3>
                      <strong>Status: </strong>
                      {item.status}
                    </h3>
                    <h3>
                      <strong>Type: </strong>
                      {item.type.name}
                    </h3>
                    <h3>
                      <strong>Comment: </strong>
                      {item.comment}
                    </h3>
                    <h3>
                      <strong>Created At: </strong>
                      {item.createdAt}
                    </h3>
                    <h3>
                      <strong>Created By: </strong>
                      {item.createdBy?.name ?? "No Data"}
                    </h3>
                    <h3>
                      <strong>Updated At: </strong>
                      {item.updatedAt ?? "No Data"}
                    </h3>
                    <h3>
                      <strong>Updated By: </strong>
                      {item.updatedBy?.name ?? "No Data"}
                    </h3>
                  </div>
                  <div
                    className={`${onEdit === item.id ? "flex" : "hidden"} items-center justify-between`}
                  >
                    <div className="flex flex-col m-2">
                      <input
                        type="text"
                        className="input-def m-1 w-full text-black "
                        placeholder={`Comment: ${item.name}`}
                      />
                      <input
                        type="text"
                        className="input-def m-1 w-full text-black "
                        placeholder={`Comment: ${item.comment}`}
                      />
                    </div>
                    <div className="flex flex-col m-2">
                      <input
                        type="text"
                        className="input-def m-1 w-full text-black"
                        placeholder={`Status: ${item.status}`}
                      />
                      <input
                        type="text"
                        className="input-def m-1 w-full text-black "
                        placeholder={`Comment: ${item.type.name}`}
                      />
                    </div>
                    <button className="btn m-2">Update</button>
                  </div>
                  <div className="flex flex-col">
                    <button className="btn flex-grow">Delete</button>
                    <button
                      onClick={() => {
                        setOnEdit(isOpenId);
                      }}
                      className={`btn ${onEdit !== item.id ? "flex" : "hidden"} flex-grow`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setOnEdit("");
                      }}
                      className={`btn ${onEdit === item.id ? "flex" : "hidden"} flex-grow`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
}

export default HrCasesList;
