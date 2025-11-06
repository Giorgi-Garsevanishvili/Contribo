"use client";

import { Prisma } from "@prisma/client";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import LoadingComp from "@/(components)/generalComp/LoadingComp";
import DeleteButton from "@/(components)/panelComp/DeleteButton";
import AllowedUserComp, {
  UserAddObj,
  UserAddType,
} from "@/(components)/panelComp/AllowedUserComp";
import Alerts, {
  AlertObj,
  AlertType,
  triggerAlert,
} from "@/(components)/generalComp/Alerts";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";

type AllowedUsersWithRelations = Prisma.AllowedUserGetPayload<{
  include: { role: true; region: true; createdBy: true };
}>;

function UsersComponent() {
  const [userData, setUserData] = useState<AllowedUsersWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAdd, setUserAdd] = useState<UserAddType>(UserAddObj);
  const [alert, setAlert] = useState<AlertType>(AlertObj);

  useEffect(() => {
    if (!alert.isOpened) return;

    const timeoutId = setTimeout(
      () => setAlert((prev) => ({ ...prev, isOpened: false })),
      4500
    );

    return () => clearTimeout(timeoutId);
  }, [alert.isOpened]);

  const CreateAllowedUser = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (Object.values(userAdd).some((value) => value === "")) {
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
      await axios.post("/api/console/allowed-users", userAdd);
      setIsLoading(false);
      triggerAlert({
        message: "User Added",
        type: "success",
        isOpened: true,
        setState: setAlert,
      });
      fetchUsers();
      setUserAdd(UserAddObj);
    } catch (error) {
      const errorMessage = getClientErrorMessage(error);
      setIsLoading(false);
      setUserAdd(UserAddObj);
      triggerAlert({
        message: errorMessage,
        type: "error",
        isOpened: true,
        setState: setAlert,
      });
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
          <div className="flex items-start justify-center mb-1 p-1 w-full h-full px-3  overflow-auto">
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
                  <DeleteButton
                    id={user.id}
                    method="allowedUser"
                    onDelete={fetchUsers}
                  />
                </li>
              ))}
            </ul>
          </div>
          <Alerts
            message={alert.message}
            type={alert.type}
            isOpened={alert.isOpened}
          />
          <AllowedUserComp
            CreateAllowedUser={CreateAllowedUser}
            userAdd={userAdd}
            setAddUser={setUserAdd}
          />
        </div>
      )}
    </div>
  );
}

export default UsersComponent;
