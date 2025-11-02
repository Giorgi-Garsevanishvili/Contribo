"use client";

import LoadingComp from "@/(components)/LoadingComp";
import { Prisma } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import Link from "next/link";

type AllowedUsersWithRelations = Prisma.AllowedUserGetPayload<{
  include: { role: true; region: true; createdBy: true };
}>;

function UsersComponent() {
  const [userData, setUserData] = useState<AllowedUsersWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addOpened, setAddOpened] = useState(false);
  const fetchUsers = async () => {
    try {
      const data = await axios.get<AllowedUsersWithRelations[]>(
        "/api/console/allowed-users"
      );
      setUserData(data.data);
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
    <div className="flex w-[22rem] h-[25rem] items-start justify-center m-1 text-white p-1 bg-gray-500/75 rounded-xl">
      {isLoading ? (
        <LoadingComp />
      ) : (
        <div className=" flex flex-col justify-start items-center relative w-full h-full">
          <div className="text-lg text-gray-800 font-bold pb-1 px-7 mb-3 rounded-b-3xl drop-shadow-sm shadow-white shadow-md">
            <h1>Allowed Users</h1>
          </div>

          <div>
            <ul className="flex flex-wrap gap-3 justify-center overflow-y-auto">
              {userData.map((user, index) => (
                <li
                  className="flex bg-gray-700 rounded-lg w-fit p-3 items-center justify-between"
                  key={user.id}
                >
                  <Link href={"/"} className="flex items-center justify-center">
                    <h5>{index + 1}.</h5>
                    <h5 className="mx-2">{user.email}</h5>
                  </Link>
                  <button className="btn  bg-red-900 rounded-lg p-1 m-0">
                    <MdDeleteOutline size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col absolute bottom-0 w-full border-t-2 border-gray-900/80 border-dotted items-center justify-center">
            <button
              onClick={() => setAddOpened(!addOpened)}
              className="flex btn w-full ease-in-out duration-300 transition items-center justify-center  bg-black rounded-lg m-0 mt-1.5"
            >
              {addOpened ? "Close Add User Section" : "Open Add User Section"}
            </button>

            <div
              className={`flex w-full overflow-hidden ${
                addOpened
                  ? "max-h-40 opacity-100 pointer-events-auto"
                  : "max-h-0 opacity-0 pointer-events-none"
              }  items-center  justify-center ease-in-out duration-300 transition`}
            >
              <input
                type="text"
                placeholder="Add Allowed User Email"
                className="flex w-full text-black p-2 bg-white m-2 rounded-lg"
              />
              <button className="flex btn items-center justify-center  bg-green-900 rounded-lg m-0.5 p-2.5">
                <AiOutlineUserAdd size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersComponent;
