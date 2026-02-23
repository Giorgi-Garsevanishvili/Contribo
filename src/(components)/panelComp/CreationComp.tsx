import React, { FormEvent, useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import LoadingComp from "../generalComp/LoadingComp";
import useRegionRole from "@/hooks/useRegionRole";
import { AiOutlineUserAdd } from "react-icons/ai";
import RegionRoleSelect from "./RegionRoleSelect";
import { IoMdAdd } from "react-icons/io";

export type DataAddType = {
  name: string;
};

export type UserAddType = {
  email?: string;
  roleId: string[];
  regionId: string;
};

type addDataProp =
  | {
      onSubmit: (e: FormEvent<HTMLFormElement>) => void;
      setDataAdd: React.Dispatch<React.SetStateAction<UserAddType>>;
      dataAdd: UserAddType;
      CompTitle: string;
      type: "user";
      openTrigger: boolean;
    }
  | {
      onSubmit: (e: FormEvent<HTMLFormElement>) => void;
      setDataAdd: React.Dispatch<React.SetStateAction<DataAddType>>;
      dataAdd: DataAddType;
      CompTitle: string;
      type: "general";
      openTrigger: boolean;
    }
  | {
      onSubmit: (e: FormEvent<HTMLFormElement>) => void;
      setDataAdd: React.Dispatch<React.SetStateAction<DataAddType>>;
      dataAdd: DataAddType;
      CompTitle: string;
      type: "roles";
      openTrigger: boolean;
    }
  | {
      onSubmit: (e: FormEvent<HTMLFormElement>) => void;
      setDataAdd: React.Dispatch<React.SetStateAction<DataAddType>>;
      dataAdd: DataAddType;
      CompTitle: string;
      type: "regions";
      openTrigger: boolean;
    };

export const AddDataObj = { name: "" };
export const UserAddObj = { email: "", roleId: [""], regionId: "" };

function CreationComponent(props: addDataProp) {
  const { loadingHook } = useRegionRole();
  const { onSubmit, CompTitle, type, setDataAdd, dataAdd } = props;


  return (
    <div
      className={`flex ${props.openTrigger ? "p-2" : ""} bg-gray-800/20 border-2 shadow-sm shadow-white/60 border-[#3E4A56] flex-col w-full items-center justify-center rounded-lg`}
    >
      {loadingHook ? (
        <LoadingComp />
      ) : (
        <form
          onSubmit={(e) => onSubmit(e)}
          className={`grow flex-col w-full p-0.5 overflow-hidden ${
            props.openTrigger
              ? "max-h-full opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }  items-center  justify-center ease-in-out duration-300 transition overflow-y-auto`}
        >
          <div className="flex flex-row w-full items-center m-1 justify-center">
            {type === "general" ? (
              <>
                <input
                  name="text"
                  value={dataAdd.name}
                  onChange={(e) =>
                    setDataAdd((prev) => ({ ...prev, name: e.target.value }))
                  }
                  type="name"
                  placeholder={`Add ${CompTitle} name`}
                  className="flex w-full input-def m-0.5 p-1.5 "
                />
                <button
                  type="submit"
                  className="flex btn items-center justify-center text-[#ffffff]  bg-[#48765b] rounded-lg m-0.5 p-2.5"
                  disabled={loadingHook}
                >
                  <IoIosAddCircleOutline size={22} />
                </button>
              </>
            ) : type === "user" ? (
              <>
                <input
                  name="email"
                  value={dataAdd.email}
                  onChange={(e) =>
                    setDataAdd((prev) => ({ ...prev, email: e.target.value }))
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
              </>
            ) : type === "regions" ? (
              <>
                <input
                  name="name"
                  value={dataAdd.name}
                  onChange={(e) =>
                    setDataAdd((prev) => ({ ...prev, name: e.target.value }))
                  }
                  type="text"
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
              </>
            ) : type === "roles" ? (
              <>
                <input
                  name="name"
                  value={dataAdd.name}
                  onChange={(e) =>
                    setDataAdd((prev) => ({ ...prev, name: e.target.value }))
                  }
                  type="text"
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
              </>
            ) : (
              "Add Type definition not provided!"
            )}
          </div>
          {type === "user" ? <RegionRoleSelect action={setDataAdd} /> : null}
        </form>
      )}
    </div>
  );
}

export default CreationComponent;
