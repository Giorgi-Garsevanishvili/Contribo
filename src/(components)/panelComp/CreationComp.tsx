import React, { FormEvent, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import LoadingComp from "../generalComp/LoadingComp";
import useRegionRole from "@/hooks/useRegionRole";
import { AiOutlineUserAdd } from "react-icons/ai";
import RegionRoleSelect from "./RegionRoleSelect";

export type DataAddType = {
  name: string;
};

export type UserAddType = {
  email?: string;
  roleId: string;
  regionId: string;
};

type addDataProp =
  | {
      onSubmit: (e: FormEvent<HTMLFormElement>) => void;
      setDataAdd: React.Dispatch<React.SetStateAction<UserAddType>>;
      dataAdd: UserAddType;
      CompTitle: string;
      type: "user";
    }
  | {
      onSubmit: (e: FormEvent<HTMLFormElement>) => void;
      setDataAdd: React.Dispatch<React.SetStateAction<DataAddType>>;
      dataAdd: DataAddType;
      CompTitle: string;
      type: "general";
    };

export const AddDataObj = { name: "" };
export const UserAddObj = { email: "", roleId: "", regionId: "" };

function CreationComponent(props: addDataProp) {
  const [addOpened, setAddOpened] = useState(false);
  const { isLoading } = useRegionRole();
  const { onSubmit, CompTitle, type, setDataAdd, dataAdd } = props;

  return (
    <div className="flex bg-gray-800/20 p-2 border-2 shadow-sm shadow-white/60 border-[#3E4A56] flex-col w-full items-center justify-center rounded-lg">
      <button
        onClick={() => setAddOpened((prev) => !prev)}
        className="flex btn w-full ease-in-out duration-300 transition items-center justify-center  bg-black rounded-lg m-0 "
      >
        {addOpened
          ? `Close Add ${CompTitle} Section`
          : `Open Add ${CompTitle} Section`}
      </button>

      {isLoading ? (
        <LoadingComp />
      ) : (
        <form
          onSubmit={(e) => onSubmit(e)}
          className={`flex flex-col w-full p-0.5 overflow-hidden ${
            addOpened
              ? "max-h-40 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }  items-center  justify-center ease-in-out duration-300 transition`}
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
                  placeholder="Add Allowed User Email"
                  className="flex w-full input-def m-0.5 p-1.5 "
                />
                <button
                  type="submit"
                  className="flex btn items-center justify-center text-[#ffffff]  bg-[#48765b] rounded-lg m-0.5 p-2.5"
                  disabled={isLoading}
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
                  disabled={isLoading}
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
