"use client";

import { Prisma } from "@prisma/client";
import axios from "axios";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import LoadingComp from "@/(components)/generalComp/LoadingComp";
import DeleteButton from "@/(components)/panelComp/DeleteButton";
import { useRouter } from "next/navigation";
import RegionRoleSelect from "@/(components)/panelComp/RegionRoleSelect";
import { useCompAlert } from "@/hooks/useCompAlert";
import { CompAlert } from "@/redux/features/componentAlert/compAlert";

export type AllowedUsersWithRelations = Prisma.AllowedUserGetPayload<{
  include: { role: true; region: true; createdBy: true };
}>;

type UserDataUpdateType = {
  regionId: string;
  roleId: string;
};

const UserDataUpdateObj = {
  regionId: "",
  roleId: "",
};

function UsersComponent() {
  const [user, setUser] = useState<AllowedUsersWithRelations>();
  const [userData, setUserData] =
    useState<UserDataUpdateType>(UserDataUpdateObj);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const router = useRouter();
  const { triggerCompAlert } = useCompAlert();

  const params = useParams();
  const { id } = params;

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get<AllowedUsersWithRelations>(
        `/api/console/allowed-users/${id}`
      );

      const userData = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: response.data.updatedAt
          ? new Date(response.data.updatedAt)
          : null,
      };
      setUser(userData);
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
        Object.entries(userData).filter(([_, value]) => value !== "")
      );
      await axios.put<AllowedUsersWithRelations>(
        `/api/console/allowed-users/${id}`,
        cleanPayload
      );

      fetchUsers();
      triggerCompAlert({
        message: "User Updated",
        type: "success",
        isOpened: true,
      });
      setUserData(UserDataUpdateObj);
      setIsUpdateOpen(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
                <h1>Allowed User Details</h1>
              </div>

              <div className="flex flex-col w-full h-full items-center justify-start">
                <ul className="flex flex-col justify-center overflow-auto w-[95%]">
                  <li className="flex bg-gray-700 rounded-lg w-full p-3 items-center justify-between">
                    <ul className="flex flex-col items-start justify-center">
                      <li>
                        Email:{" "}
                        <span className="text-blue-300">{user?.email}</span>
                      </li>
                      <li>
                        Region:{" "}
                        <span className="text-blue-300">
                          {user?.region?.name || "Not Set"}
                        </span>
                      </li>
                      <li>
                        Role:{" "}
                        <span className="text-blue-300">
                          {user?.role?.name || "Not Set"}
                        </span>
                      </li>
                      <li>
                        Created By:{" "}
                        <span className="text-blue-300">
                          {user?.createdBy?.name || "Unknown User"}
                        </span>
                      </li>
                      <li>
                        Created At:{" "}
                        <span className="text-blue-300">
                          {user?.createdAt.toDateString()}
                        </span>
                      </li>
                      <li>
                        Updated At:{" "}
                        <span className="text-blue-300">
                          {user?.updatedAt?.toDateString() || "Not Updated"}
                        </span>
                      </li>
                      <li>
                        Type:
                        <span className="text-blue-300"> {user?.type}</span>
                      </li>
                    </ul>
                  </li>
                </ul>
                <div className="flex flex-row w-full justify-center items-center">
                  <DeleteButton
                    id={user?.id}
                    method="allowedUser"
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
              </div>

              <form
                onSubmit={updateUser}
                className={`flex bg-gray-800/70 flex-col w-full border-gray-900/80 rounded-b-none rounded-lg mb-0 m-2 pt-0 p-2.5 ${
                  isUpdateOpen
                    ? "opacity-100 pointer-events-auto visible"
                    : "opacity-0 pointer-events-none hidden"
                } items-center justify-center flex-col`}
              >
                <label className="flex items-center justify-center shadow-sm shadow-white/70 rounded-b-2xl mt-0 p-1 px-10 mb-2">Update Form</label>
                <RegionRoleSelect action={setUserData} />
                <button
                  type="submit"
                  disabled={userData.regionId === "" && userData.roleId === ""}
                  className={`flex btn text-[#ffffff]  bg-[#48765b] p-1.5 mt-3 mb-0 rounded-md w-full items-center justify-center`}
                >
                  Update User
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

export default UsersComponent;
