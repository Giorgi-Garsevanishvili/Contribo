"use client";

import axios from "axios";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import LoadingComp from "@/(components)/generalComp/LoadingComp";
import RegionRoleSelect from "@/(components)/panelComp/RegionRoleSelect";
import { useCompAlert } from "@/hooks/useCompAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { signOut } from "next-auth/react";
import {
  AllowedUsersWithRelations,
  GeneralDataUpdateType,
  GeneralDataWithRelations,
  RegionDataUpdateType,
  UserDataUpdateType,
} from "@/types/general-types";
import DeleteButton, { DeleteMethod } from "./DeleteButton";

import ListDetailComp from "./ListDetailComp";
import { Region } from "@prisma/client";
import RegionDataUpdate from "./RegionUpdateComp";

const RegionDataUpdateObj = {
  name: "",
  logo: "",
  email: "",
  phone: "",
  description: "",
  address: "",
  website: "",
  status: undefined,
};

const UserDataUpdateObj = {
  regionId: "",
  roleId: [""],
};

const GeneralDataUpdateObj = {
  name: "",
};

type MiniDashDetailsProps =
  | {
      id: string | undefined;
      type: "user";
      axiosGet: string;
      axiosPut: string;
      title: string;
      deleteMethod: DeleteMethod;
    }
  | {
      id: string | undefined;
      type: "general";
      axiosGet: string;
      axiosPut: string;
      title: string;
      deleteMethod: DeleteMethod;
    }
  | {
      id: string | undefined;
      type: "region";
      axiosGet: string;
      axiosPut: string;
      title: string;
      deleteMethod: DeleteMethod;
    };

function MiniDashDetails<
  T extends Region & AllowedUsersWithRelations & GeneralDataWithRelations
>({ title, axiosGet, axiosPut, type, deleteMethod, id }: MiniDashDetailsProps) {
  const router = useRouter();
  const [data, setData] = useState<T>();

  const [updateUserData, setUpdateUserData] =
    useState<UserDataUpdateType>(UserDataUpdateObj);
  const [updateRegionData, setUpdateRegionData] =
    useState<RegionDataUpdateType>(RegionDataUpdateObj);
  const [updateGeneralData, setUpdateGeneralData] =
    useState<GeneralDataUpdateType>(GeneralDataUpdateObj);

  const dataSwitch = () => {
    if (type === "user") {
      return {
        data: updateUserData,
        clean: () => setUpdateUserData(UserDataUpdateObj),
      };
    }

    if (type === "general") {
      return {
        data: updateGeneralData,
        clean: () => setUpdateGeneralData(GeneralDataUpdateObj),
      };
    }

    if (type === "region") {
      return {
        data: updateRegionData,
        clean: () => setUpdateRegionData(RegionDataUpdateObj),
      };
    }

    throw new Error("Oops! Something went wrong!");
  };

  const switcher = dataSwitch();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const { triggerCompAlert } = useCompAlert();

  const fetchData = useCallback(
    async (id: string | undefined) => {
      try {
        const response = await axios.get(`${axiosGet}/${id}`);

        const userData = {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: response.data.updatedAt
            ? new Date(response.data.updatedAt)
            : null,
        };
        const roleIds = userData.roles.map((r: { roleId: string }) => r.roleId);
        setUpdateUserData({ regionId: "", roleId: roleIds });
        setData(userData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        return;
      }
    },
    [axiosGet]
  );

  const updateDataFn = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const cleanPayload = Object.fromEntries(
        Object.entries(switcher?.data).filter(
          ([_, value]) => value !== "" && value !== undefined
        )
      );

      const res = await axios.put(`${axiosPut}/${id}`, cleanPayload);
      const signOutReq = res.data.requiresSignOut === true;
      if (signOutReq) {
        setTimeout(async () => {
          await signOut({ callbackUrl: "/" });
          return;
        }, 4000);
      }

      fetchData(id);
      triggerCompAlert({
        message: signOutReq
          ? "Your account updated please sign in again!"
          : `${title} Updated`,
        type: signOutReq ? "warning" : "success",
        isOpened: true,
      });
      switcher.clean();
      setIsUpdateOpen(false);
    } catch (error) {
      const errorMsg = getClientErrorMessage(error);
      triggerCompAlert({
        message: errorMsg,
        type: "error",
        isOpened: true,
      });
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    fetchData(id);
  }, [id, axiosGet, fetchData]);

  return (
    <div className="flex w-[22rem] h-[28rem] flex-col shadow-md shadow-white rounded-lg">
      <div className="flex flex-col w-full h-full scroll-smooth overflow-y-auto items-center justify-center m-0  text-white bg-gray-500/75 rounded-t-lg">
        {isLoading ? (
          <LoadingComp />
        ) : (
          <div className=" flex flex-col justify-start items-center relative w-full h-full">
            <div className="text-lg text-white font-bold p-1 px-7 mb-3 rounded-b-3xl drop-shadow-sm shadow-white shadow-md">
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
              <>
                <div>
                  <h3>Failed to fetch!</h3>
                </div>
              </>
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
                {isUpdateOpen ? <IoClose size={20} /> : <FaRegEdit size={20} />}
              </button>
            </div>

            <form
              onSubmit={updateDataFn}
              className={`flex bg-gray-800/70 flex-col w-full border-gray-900/80 rounded-b-none rounded-lg mb-0 m-2 pt-0 p-2.5 ${
                isUpdateOpen
                  ? "opacity-100 pointer-events-auto visible"
                  : "opacity-0 pointer-events-none hidden"
              } items-center justify-center flex-col`}
            >
              <label className="flex items-center justify-center shadow-sm shadow-white/70 rounded-b-2xl mt-0 p-1 px-10 mb-2">
                Update Form
              </label>
              {type === "user" ? (
                <RegionRoleSelect
                  user={updateUserData}
                  action={setUpdateUserData}
                />
              ) : type === "region" ? (
                <RegionDataUpdate action={setUpdateRegionData} />
              ) : type === "general" ? (
                <>
                  <div className="flex w-full">
                    <input
                      value={updateGeneralData.name}
                      onChange={(e) =>
                        setUpdateGeneralData({
                          ...updateGeneralData,
                          name: e.target.value,
                        })
                      }
                      className="input-def flex w-full"
                      placeholder="Enter New Name"
                      type="text"
                    />
                  </div>
                </>
              ) : null}

              <button
                type="submit"
                disabled={
                  !Object.values(switcher.data).some(
                    (value) => value !== "" && value !== undefined
                  )
                }
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
          replace
          className="flex btn w-full ease-in-out duration-300 transition items-center justify-center m-0 bg-black rounded-b-lg rounded-t-none"
        >
          Back To List
        </Link>
      </div>
    </div>
  );
}

export default MiniDashDetails;
