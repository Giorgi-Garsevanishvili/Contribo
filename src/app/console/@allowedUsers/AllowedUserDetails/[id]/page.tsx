"use client";

import LoadingComp from "@/(components)/LoadingComp";
import { Prisma } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { TbEditOff } from "react-icons/tb";

type AllowedUsersWithRelations = Prisma.AllowedUserGetPayload<{
  include: { role: true; region: true; createdBy: true };
}>;

function UsersComponent() {
  const [user, setUser] = useState<AllowedUsersWithRelations>();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const params = useParams();
  const { id } = params;

  const fetchUsers = async () => {
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
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col w-[22rem] h-[25rem] scroll-smooth overflow-y-auto items-center justify-center m-0 ove text-white bg-gray-500/75 rounded-t-lg">
        {isLoading ? (
          <LoadingComp />
        ) : (
          <div className=" flex flex-col justify-start items-center relative w-full h-full">
            <div className="text-lg text-gray-800 font-bold p-1 px-7 mb-3 rounded-b-3xl drop-shadow-sm shadow-white shadow-md">
              <h1>Allowed User Details</h1>
            </div>

            <div className="flex flex-col w-full h-full items-center justify-center">
              <ul className="flex flex-col justify-center overflow-scroll">
                <li className="flex bg-gray-700 rounded-lg w-fit p-3 items-center justify-between">
                  <ul className="flex flex-col items-start justify-center">
                    <li>Email: {user?.email}</li>
                    <li>Region: {user?.region?.name || "Not Set"}</li>
                    <li>Role: {user?.role?.name || "Not Set"}</li>
                    <li>
                      Created By: {user?.createdBy?.name || "Unknown User"}
                    </li>
                    <li>Created At: {user?.createdAt.toDateString()}</li>
                    <li>
                      Updated At:{" "}
                      {user?.updatedAt?.toDateString() || "Not Updated"}
                    </li>
                    <li>Type: {user?.type}</li>
                  </ul>
                </li>
              </ul>
              <div className="flex flex-row w-full justify-center items-center">
                <button className="btn w-20 items-center justify-center bg-red-900 rounded-lg">
                  <MdDeleteOutline size={20} />
                </button>
                <button
                  onClick={() => setIsUpdateOpen(!isUpdateOpen)}
                  className={`btn w-20 justify-center items-center transition duration-300 ease-in-out ${
                    isUpdateOpen ? "bg-amber-500" : "bg-amber-100"
                  }  text-black rounded-lg `}
                >
                  {isUpdateOpen ? (
                    <TbEditOff size={20} />
                  ) : (
                    <FaRegEdit size={20} />
                  )}
                </button>
              </div>
            </div>

            <form
              className={`flex w-full transition duration-300 ease-in-out p-2 ${
                isUpdateOpen
                  ? "opacity-100 pointer-events-auto visible"
                  : "opacity-0 pointer-events-none hidden"
              } items-center justify-center flex-col`}
            >
              <label>Update Form</label>
              <div className="flex w-full items-center justify-center p-1">
                <label htmlFor="region" className="flex p-2">
                  Region:
                </label>

                <select
                  name="region"
                  id="region"
                  className="flex w-full text-black p-2 bg-gray-400/70 text -black rounded-lg"
                >
                  <option value="Riga">Riga</option>
                  <option value="Jelgava">Jelgava</option>
                </select>
              </div>
              <div className="flex w-full items-center justify-center p-1">
                <label htmlFor="Role" className="flex p-2">
                  Role:
                </label>

                <select
                  name="Role"
                  id="Role"
                  className="flex w-full text-black p-2 bg-gray-400/70 text -black rounded-lg"
                >
                  <option value="Admin">Admin</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>
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
    </>
  );
}

export default UsersComponent;
