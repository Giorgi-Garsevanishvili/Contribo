import { User } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingComp from "../LoadingComp";

function UsersComponent() {
  const [userData, setUserData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchUsers = async () => {
    try {
      const data = await axios.get<User[]>("api/console/users");
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
    <div className="flex min-w-90 min-h-100 items-start justify-center text-white p-3 bg-gray-500/75 rounded-xl">
      {isLoading ? (
        <LoadingComp />
      ) : (
        <div className=" flex flex-col justify-center items-center"> 
          <h1 className="text-xl text-gray-800 font-bold p-3 mb-3 rounded-b-3xl drop-shadow-sm shadow-white shadow-md">Allowed Users</h1>
          {userData.map((user) => (
            <ul key={user.id}>
              <li>{user.email}</li>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersComponent;
