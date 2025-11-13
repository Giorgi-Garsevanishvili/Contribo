"use client";

import axios from "axios";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import LoadingComp from "@/(components)/generalComp/LoadingComp";
import RegionRoleSelect from "@/(components)/panelComp/RegionRoleSelect";
import { useCompAlert } from "@/hooks/useCompAlert";
import { CompAlert } from "@/redux/features/componentAlert/compAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import {
  AllowedUsersWithRelations,
  GeneralDataWithRelations,
} from "@/types/general-types";
import { RegionUpdateDataType } from "@/lib/zod";
import DeleteButton, { DeleteMethod } from "./DeleteButton";
import { Region } from "@prisma/client";
import ListDetailComp from "./ListDetailComp";

type UserDataUpdateType = {
  regionId: string;
  roleId: string;
};

type GeneralDataUpdateType = {
  name: string;
};

type RegionDataUpdateType = RegionUpdateDataType;

const RegionDataUpdateObj = {
  name: "",
  logo: "",
  email: "",
  phone: "",
  description: "",
  address: "",
  website: "",
  status: "",
};

const UserDataUpdateObj = {
  regionId: "",
  roleId: "",
};

const GeneralDataUpdateObj = {
  name: "",
};

type MiniDashDetailsProps<T, U> = {
  type: "user" | "general" | "region";
  axiosGet: string;
  axiosPut: string;
  title: string;
  deleteMethod: DeleteMethod;
};

function MiniDashDetails<
  T extends AllowedUsersWithRelations | Region | GeneralDataWithRelations,
  U extends GeneralDataUpdateType | UserDataUpdateType | RegionDataUpdateType
>({
  title,
  axiosGet,
  axiosPut,
  type,
  deleteMethod,
}: MiniDashDetailsProps<T, U>) {
  const router = useRouter();
  const [data, setData] = useState<T>();
  const dataClear = () => {
    if (type === "general") {
      return GeneralDataUpdateObj as U;
    }
    if (type === "region") {
      return RegionDataUpdateObj as U;
    }

    if (type === "user") {
      return UserDataUpdateObj as U;
    }
    return {} as U;
  };
  const [updateData, setUpdateData] = useState<U>(dataClear);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const { triggerCompAlert } = useCompAlert();

  const params = useParams();
  const { id } = params;

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<AllowedUsersWithRelations>(
        `${axiosGet}/${id}`
      );

      const userData = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: response.data.updatedAt
          ? new Date(response.data.updatedAt)
          : null,
      };
      setData(userData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return;
    }
  }, [id]);

  const updateUser = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const cleanPayload = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== "")
      );
      await axios.put<AllowedUsersWithRelations>(
        `${axiosPut}/${id}`,
        cleanPayload
      );

      fetchData();
      triggerCompAlert({
        message: `${title} Updated`,
        type: "success",
        isOpened: true,
      });
      setUpdateData(dataClear);
      setIsUpdateOpen(false);
    } catch (error) {
      const errorMsg = getClientErrorMessage(error);
      triggerCompAlert({
        message: errorMsg,
        type: "error",
        isOpened: true,
      });
      setIsLoading(false);
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col items-center justify-center">
      <CompAlert />
      <div className="flex flex-col shadow-md shadow-white rounded-lg">
        <div className="flex flex-col w-[22rem] h-[28rem] scroll-smooth overflow-y-auto items-center justify-center m-0 ove text-white bg-gray-500/75 rounded-t-lg">
          {isLoading ? (
            <LoadingComp />
          ) : (
            <div className=" flex flex-col justify-start items-center relative w-full h-full">
              <div className="text-lg text-gray-800 font-bold p-1 px-7 mb-3 rounded-b-3xl drop-shadow-sm shadow-white shadow-md">
                <h1>{title} Details</h1>
              </div>
              {data ? (
                type === "user" ? (
                  <ListDetailComp type={type} data={data} />
                ) : type === "general" ? (
                  <ListDetailComp type={type} data={data} />
                ) : type === "region" ? (
                  <ListDetailComp type={type} data={data} />
                ) : (
                  "Oops! Something is Missing in MiniComp Details"
                )
              ) : (
                "No data found!"
              )}
              <div className="flex flex-row w-full justify-center items-center">
                <DeleteButton
                  id={data?.id}
                  method={deleteMethod}
                  onDelete={() =>
                    setTimeout(() => {
                      router.push("/console");
                    }, 500)
                  }
                />

                <button
                  onClick={() => setIsUpdateOpen(!isUpdateOpen)}
                  className={`btn flex flex-grow justify-center items-center rounded-lg  m-1 ${
                    isUpdateOpen ? "bg-amber-500" : "bg-amber-100"
                  }  text-black rounded-lg `}
                >
                  {isUpdateOpen ? (
                    <IoClose size={20} />
                  ) : (
                    <FaRegEdit size={20} />
                  )}
                </button>
              </div>

              <form
                onSubmit={updateUser}
                className={`flex bg-gray-800/70 flex-col w-full border-gray-900/80 rounded-b-none rounded-lg mb-0 m-2 pt-0 p-2.5 ${
                  isUpdateOpen
                    ? "opacity-100 pointer-events-auto visible"
                    : "opacity-0 pointer-events-none hidden"
                } items-center justify-center flex-col`}
              >
                <label className="flex items-center justify-center shadow-sm shadow-white/70 rounded-b-2xl mt-0 p-1 px-10 mb-2">
                  Update Form
                </label>
                <RegionRoleSelect action={setUpdateData} />
                <button
                  type="submit"
                  // disabled={userData.regionId === "" && userData.roleId === ""}
                  className={`flex btn text-[#ffffff]  bg-[#48765b] p-1.5 mt-3 mb-0 rounded-md w-full items-center justify-center`}
                >
                  Update {title}
                </button>
              </form>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full text-white border-gray-900/80 items-center justify-center">
          <Link
            href={"/console"}
            className="flex btn w-full ease-in-out duration-300 transition items-center justify-center m-0 bg-black rounded-b-lg rounded-t-none"
          >
            Back To List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MiniDashDetails;
