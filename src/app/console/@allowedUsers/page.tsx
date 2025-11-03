"use client";

import LoadingComp from "@/(components)/LoadingComp";
import { Prisma, Role } from "@prisma/client";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import Link from "next/link";
import DeleteButton from "@/(components)/DeleteButton";

type AllowedUsersWithRelations = Prisma.AllowedUserGetPayload<{
  include: { role: true; region: true; createdBy: true };
}>;

function UsersComponent() {
  const [userData, setUserData] = useState<AllowedUsersWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addOpened, setAddOpened] = useState(false);
  const [userEmail, setUserEmail] = useState<{ email: string }>({ email: "" });
  const [roles, setRoles] = useState<Role[]>([]);

  const GetRoles = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/console/roles");
      setRoles(response.data);
    } catch (error) {
      console.log(error);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const OpenAdd = () => {
    !addOpened && roles.length === 0 ? GetRoles() : null;

    setAddOpened(!addOpened);
  };

  const CreateAllowedUser = async (e: FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      await axios.post("/api/console/allowed-users", userEmail);
      setIsLoading(false);
      setUserEmail({ email: "" });
      fetchUsers();
    } catch (error) {
      setIsLoading(false);
      setUserEmail({ email: "" });
      console.log(error);
      return;
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
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

  const deleteAllowedUser = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/console/allowed-users/${id}`);
      fetchUsers();
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
    <div className="flex w-[22rem] h-[28rem] items-start justify-center m-2 text-white pt-0 p-0.5 bg-gray-500/75 rounded-xl shadow-md shadow-white ">
      {isLoading ? (
        <LoadingComp />
      ) : (
        <div className="flex flex-col justify-between items-center relative w-full h-full">
          <div className="text-lg text-white bg-gray-900  font-bold px-7 pb-1 rounded-b-3xl drop-shadow-sm shadow-white shadow-md">
            <h1>Allowed Users</h1>
          </div>
          <div className="flex w-full items-center mt-1 justify-center">
            <input
              className="flex w-full bg-gray-300 text-black p-2.5 m-2 rounded-lg"
              type="text"
              name="search"
              placeholder="Find by Email"
            />
          </div>
          <div className="flex items-start justify-center mb-1 p-1 w-full px-3  overflow-auto">
            <ul className="flex flex-col flex-grow gap-2 items-start justify-center">
              {userData.map((user, index) => (
                <li
                  className="flex bg-gray-700 rounded-lg w-full p-1 items-center justify-between"
                  key={user.id}
                >
                  <Link
                    href={`/console/AllowedUserDetails/${user.id}`}
                    className="flex items-center justify-start bg-black/40 text-white m-1 pl-2 p-1 rounded-lg w-full"
                  >
                    <h5>{index + 1}.</h5>
                    <h5 className="mx-2">{user.email}</h5>
                  </Link>
                  <DeleteButton onDelete={() => deleteAllowedUser(user.id)} />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex bg-gray-800/70 flex-col  w-full border-t-2 border-gray-900/80 border-dotted items-center justify-center rounded-lg">
            <button
              onClick={OpenAdd}
              className="flex btn w-full ease-in-out duration-300 transition items-center justify-center  bg-black rounded-lg m-0 mt-1.5"
            >
              {addOpened ? "Close Add User Section" : "Open Add User Section"}
            </button>

            <form
              onSubmit={(e) => CreateAllowedUser(e)}
              className={`flex flex-col w-full p-0.5 overflow-hidden ${
                addOpened
                  ? "max-h-40 opacity-100 pointer-events-auto"
                  : "max-h-0 opacity-0 pointer-events-none"
              }  items-center  justify-center ease-in-out duration-300 transition`}
            >
              <div className="flex flex-row w-full items-center justify-center">
                <input
                  name="email"
                  value={userEmail.email}
                  onChange={(e) => setUserEmail({ email: e.target.value })}
                  type="email"
                  placeholder="Add Allowed User Email"
                  className="flex w-full text-black p-2 bg-white m-2 rounded-lg"
                />
                <button
                  type="submit"
                  className="flex btn items-center justify-center  bg-green-900 rounded-lg m-0.5 p-2.5"
                >
                  <AiOutlineUserAdd size={18} />
                </button>
              </div>
              <div className="flex w-full items-center justify-center flex-row">
                <form className="flex flex-row items-center justify-between w-[80%] p-1">
                  <label htmlFor="role">Role: </label>
                  <select
                    className=" flex bg-amber-50 text-black flex-grow items-center justify-center mx-2 p-0.5 rounded-lg"
                    name="role"
                    id="role"
                  >
                    {roles.map((role) => (
                      <option value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </form>
                <form className="flex flex-row items-center justify-between w-[80%] p-1">
                  <label htmlFor="role">Region: </label>
                  <select
                    className=" flex bg-amber-50 text-black flex-grow items-center justify-center mx-2 p-0.5 rounded-lg"
                    name="role"
                    id="role"
                  >
                    <option value="null">null</option>
                  </select>
                </form>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersComponent;
