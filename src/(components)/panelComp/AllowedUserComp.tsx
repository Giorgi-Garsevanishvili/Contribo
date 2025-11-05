import React, { FormEvent, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import LoadingComp from "../generalComp/LoadingComp";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRoles,
  getAllRoles,
  rolesLoading,
  regionLoading,
  getAllRegion,
  fetchRegions,
  //rolesError,
  //regionsError,
} from "@/redux/features/allowedUsers/allowedRoleSlice";
import { AppDispatch } from "@/redux/store";

export type UserAddType = typeof UserAddObj;
export const UserAddObj = { email: "", roleId: "", regionId: "" };

type AddAllowedUserProp = {
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

  const dispatch = useDispatch<AppDispatch>();
  const loadingRoles = useSelector(rolesLoading);
  const loadingRegions = useSelector(regionLoading);
  //const rolesErrorMsg = useSelector(rolesError);
  //const regionErrorMsg = useSelector(regionsError);
  const roles = useSelector(getAllRoles);
  const regions = useSelector(getAllRegion);

  const isLoading = loadingRegions === "pending" || loadingRoles === "pending";
  //const error = rolesErrorMsg || regionErrorMsg;

  const OpenAdd = () => {
    const newOpenState = !addOpened;
    setAddOpened(newOpenState);
    if (newOpenState && roles.length === 0 && regions.length === 0) {
      dispatch(fetchRoles());
      dispatch(fetchRegions());
    }
  };

  return (
    <div className="flex bg-gray-800/70 flex-col  w-full border-t-2 border-gray-900/80 border-dotted items-center justify-center rounded-lg">
      <button
        onClick={OpenAdd}
        className="flex btn w-full ease-in-out duration-300 transition items-center justify-center  bg-black rounded-lg m-0 mt-1.5"
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
          <div className="flex flex-row w-full items-center justify-center">
            <input
              name="email"
              value={userAdd.email}
              onChange={(e) =>
                setAddUser((prev) => ({ ...prev, email: e.target.value }))
              }
              type="email"
              placeholder="Add Allowed User Email"
              className="flex w-full text-black p-2 bg-white m-2 rounded-lg"
            />
            <button
              type="submit"
              className="flex btn items-center justify-center  bg-green-900 rounded-lg m-0.5 p-2.5"
              disabled={isLoading}
            >
              <AiOutlineUserAdd size={18} />
            </button>
          </div>
          <div className="flex w-full items-center justify-center flex-row">
            <div className="flex flex-row items-center justify-between w-[80%] p-1">
              <label htmlFor="role">Role: </label>
              <select
                onChange={(e) =>
                  setAddUser((prev) => ({ ...prev, roleId: e.target.value }))
                }
                className=" flex bg-amber-50 text-black flex-grow items-center justify-center mx-2 p-0.5 rounded-lg"
                name="role"
                id="role"
              >
                <option value=""></option>
                {roles
                  ? roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))
                  : "Oops! Something went wrong!"}
              </select>
            </div>
            <div className="flex flex-row items-center justify-between w-[80%] p-1">
              <label htmlFor="role">Region: </label>
              <select
                onChange={(e) =>
                  setAddUser((prev) => ({ ...prev, regionId: e.target.value }))
                }
                className=" flex bg-amber-50 text-black flex-grow items-center justify-center mx-2 p-0.5 rounded-lg"
                name="role"
                id="role"
              >
                <option value=""></option>
                {regions
                  ? regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))
                  : "Oops! Something went wrong!"}
              </select>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default AllowedUserComp;
