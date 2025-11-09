import React, { FormEvent, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import LoadingComp from "../generalComp/LoadingComp";
import RegionRoleSelect from "./RegionRoleSelect";
import useRegionRole from "@/hooks/useRegionRole";

export type UserAddType = {
  email?: string;
  roleId: string;
  regionId: string;
};

export const UserAddObj = { email: "", roleId: "", regionId: "" };

export type AddAllowedUserProp = {
  CreateAllowedUser: (e: FormEvent<HTMLFormElement>) => void;
  setAddUser: React.Dispatch<React.SetStateAction<UserAddType>>;
  userAdd: UserAddType;
};

function AllowedUserComp({
  CreateAllowedUser,
  setAddUser,
  userAdd,
}: AddAllowedUserProp) {
  const [addOpened, setAddOpened] = useState(false);
  const { isLoading } = useRegionRole();

  return (
    <div className="flex bg-gray-800/70 flex-col w-full border-gray-900/80 items-center justify-center rounded-lg">
      <button
        onClick={() => setAddOpened((prev) => !prev)}
        className="flex btn w-full ease-in-out duration-300 transition items-center justify-center  bg-black rounded-lg m-0 "
      >
        {addOpened ? "Close Add User Section" : "Open Add User Section"}
      </button>

      {isLoading ? (
        <LoadingComp />
      ) : (
        <form
          onSubmit={(e) => CreateAllowedUser(e)}
          className={`flex flex-col w-full p-0.5 overflow-hidden ${
            addOpened
              ? "max-h-40 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }  items-center  justify-center ease-in-out duration-300 transition`}
        >
          <div className="flex flex-row w-full items-center m-1 justify-center">
            <input
              name="email"
              value={userAdd.email}
              onChange={(e) =>
                setAddUser((prev) => ({ ...prev, email: e.target.value }))
              }
              type="email"
              placeholder="Add Allowed User Email"
              className="flex w-full text-black p-2 bg-white m-0.5 rounded-lg"
            />
            <button
              type="submit"
              className="flex btn items-center justify-center  bg-green-900 rounded-lg m-0.5 p-2.5"
              disabled={isLoading}
            >
              <AiOutlineUserAdd size={18} />
            </button>
          </div>
          <RegionRoleSelect action={setAddUser} />
        </form>
      )}
    </div>
  );
}

export default AllowedUserComp;
