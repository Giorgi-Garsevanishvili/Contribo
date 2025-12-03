import React, { FormEvent, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import LoadingComp from "../generalComp/LoadingComp";
import RegionRoleSelect from "./RegionRoleSelect";
import useRegionRole from "@/hooks/useRegionRole";

export type UserAddType = {
  email?: string;
  roleId: string[];
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
  const { loadingHook } = useRegionRole();

  return (
    <div className="flex bg-gray-800/20 p-2 border-2 shadow-sm shadow-white/60 border-[#3E4A56] flex-col w-full items-center justify-center rounded-lg">
      <button
        onClick={() => setAddOpened((prev) => !prev)}
        className="flex btn w-full ease-in-out duration-300 transition items-center justify-center  bg-black rounded-lg m-0 "
      >
        {addOpened ? "Close Add User Section" : "Open Add User Section"}
      </button>

      {loadingHook ? (
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
              className="flex w-full input-def m-0.5 p-1.5 "
            />
            <button
              type="submit"
              className="flex btn items-center justify-center text-[#ffffff]  bg-[#48765b] rounded-lg m-0.5 p-2.5"
              disabled={loadingHook}
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
