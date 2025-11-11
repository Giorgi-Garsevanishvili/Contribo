"use client";

import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import LoadingComp from "@/(components)/generalComp/LoadingComp";
import Alerts, {
  AlertObj,
  AlertType,
  triggerAlert,
} from "@/(components)/generalComp/Alerts";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { CompAlert } from "@/redux/features/componentAlert/compAlert";
import CreationComponent, {
  AddDataObj,
  DataAddType,
  UserAddObj,
  UserAddType,
} from "./CreationComp";

type MiniCompProps<T, U extends UserAddType | DataAddType> = {
  DataType?: T[];
  DataAddType?: U;
  axiosPost: string;
  axiosGet: string;
  title: string;
  searchKey: keyof T;
  type: "user" | "general";
  renderItems?: (item: T, index: number) => React.ReactNode;
};

function MiniDashCard<T, U extends UserAddType | DataAddType>({
  axiosPost,
  title,
  axiosGet,
  searchKey,
  renderItems,
  type,
}: MiniCompProps<T, U>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dataClear = () => {
    if (type === "user") {
      return UserAddObj as U;
    }
    if (type === "general") {
      return AddDataObj as U;
    }
    return {} as U;
  };
  const [dataAdd, setDataAdd] = useState<U>(dataClear);
  const [alert, setAlert] = useState<AlertType>(AlertObj);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!alert.isOpened) return;

    const timeoutId = setTimeout(
      () => setAlert((prev) => ({ ...prev, isOpened: false })),
      4500
    );

    return () => clearTimeout(timeoutId);
  }, [alert.isOpened]);

  const createFunction = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (Object.values(data).some((value) => value === "")) {
        triggerAlert({
          message: "All fields are required",
          type: "warning",
          isOpened: true,
          setState: setAlert,
        });
        return;
      }

      setIsLoading(true);
      e.preventDefault();
      await axios.post(`${axiosPost}`, dataAdd);
      setIsLoading(false);
      triggerAlert({
        message: `${title} Added`,
        type: "success",
        isOpened: true,
        setState: setAlert,
      });
      fetchData();
      setDataAdd(dataClear);
    } catch (error) {
      const errorMessage = getClientErrorMessage(error);
      setIsLoading(false);
      setDataAdd(dataClear);
      triggerAlert({
        message: errorMessage,
        type: "error",
        isOpened: true,
        setState: setAlert,
      });
      return;
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await axios.get<T[]>(`${axiosGet}`);
      setData(data.data);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = getClientErrorMessage(error);
      setIsLoading(false);
      triggerAlert({
        message: errorMessage,
        type: "error",
        isOpened: true,
        setState: setAlert,
      });
      return;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    return searchTerm === ""
      ? true
      : String(item[searchKey])
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col items-center m-1 justify-center">
      <CompAlert />
      <div className="flex w-[22rem] h-[28rem] items-start justify-center mt-0 m-2 text-white pt-0 p-0.5 bg-[#212833c8] rounded-xl shadow-md shadow-white ">
        {isLoading ? (
          <LoadingComp />
        ) : (
          <div className="flex flex-col justify-between items-center relative w-full h-full">
            <div className="text-lg text-white bg-gray-900  font-bold px-7 pb-1 rounded-b-3xl drop-shadow-sm shadow-white shadow-md">
              <h1>{title}</h1>
            </div>
            <div className="flex w-full items-center mt-1 justify-center">
              <input
                className="flex w-full input-def"
                type="text"
                name="search"
                placeholder={`Find by ${String(searchKey)}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-start justify-center mb-1 p-1 w-full h-full px-3  overflow-auto">
              <ul className="flex flex-col flex-grow gap-2 items-start justify-center">
                <p className="text-gray-300 text-sm mt-2">No {title} found.</p>
              </ul>
            </div>
            <Alerts
              message={alert.message}
              type={alert.type}
              isOpened={alert.isOpened}
            />
            {type === "user" ? (
              <CreationComponent
                dataAdd={dataAdd as UserAddType}
                setDataAdd={
                  setDataAdd as React.Dispatch<
                    React.SetStateAction<UserAddType>
                  >
                }
                onSubmit={createFunction}
                CompTitle={title}
                type="user"
              />
            ) : type === "general" ? (
              <CreationComponent
                dataAdd={dataAdd as DataAddType}
                setDataAdd={
                  setDataAdd as React.Dispatch<
                    React.SetStateAction<DataAddType>
                  >
                }
                onSubmit={createFunction}
                CompTitle={title}
                type="general"
              />
            ) : (
              "Props are missing to display add component!"
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MiniDashCard;
