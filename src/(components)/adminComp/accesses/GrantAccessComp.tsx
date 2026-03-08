import { useCompAlert } from "@/hooks/useCompAlert";
import { useFetchData } from "@/hooks/useDataFetch";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import axios from "axios";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { ImSpinner9 } from "react-icons/im";

type RoleData = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}[];

const UserAddObj = { email: "", roleId: [""] };

function GrantAccessComp({ refetch }: { refetch: () => void }) {
  const [roles, setRoles] = useState<RoleData>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addUser, setAddUser] = useState(UserAddObj);
  const { data, isLoadingFetch } = useFetchData<RoleData>("/api/admin/roles");
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  useEffect(() => {
    const filteredRoles = data?.filter((r) => r.name !== "QIRVEX");
    filteredRoles ? setRoles(filteredRoles) : null;
  }, [data]);

  const handleGrantAccess = async (e: BaseSyntheticEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (
        !addUser.email ||
        addUser.roleId.filter((r) => r !== "").length === 0
      ) {
        triggerCompAlertRef.current({
          message: "All fields Must Be Filled",
          type: "warning",
          isOpened: true,
        });
        return;
      }

      await axios.post("/api/admin/allowedUsers", addUser);

      triggerCompAlertRef.current({
        message: "New Accessed user added",
        type: "success",
        isOpened: true,
      });

      setAddUser(UserAddObj);

      refetch();
    } catch (error) {
      const message = getClientErrorMessage(error);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col transition-all duration-200 shadow-md items-center justify-center shadow-white bg-gray-200/95 m-2 p-1 rounded-lg">
      {
        <form
          onSubmit={handleGrantAccess}
          className={`flex flex-col w-full p-1
            items-center  justify-center ease-in-out duration-300 transition`}
        >
          {isLoadingFetch || isLoading ? (
            <div className={`text-sm m-2 text-black  font-bold`}>
              <ImSpinner9 className="animate-spin" size={25} />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row w-fit items-center m-1 justify-center">
              <input
                name="email"
                value={addUser.email}
                onChange={(e) =>
                  setAddUser((prev) => ({ ...prev, email: e.target.value }))
                }
                type="email"
                placeholder="Add Allowed User Email"
                className="flex w-full bg-gray-400 input-def m-0.5 p-1.5 "
              />
              <div className="flex flex-col md:flex-row mx-1 w-full px-2 border border-gray-500 rounded-md items-center justify-center">
                <label className="flex text-sm uppercase mr-2" htmlFor="role">
                  Role:
                </label>
                {roles
                  ? roles.map((role) => (
                      <div
                        key={role.id}
                        className="select-def w-full bg-gray-600 cursor-pointer p-1.5 m-1"
                      >
                        <label className="cursor-pointer" htmlFor={role.id}>
                          {role.name}
                        </label>
                        <input
                          id={role.id}
                          checked={addUser.roleId.some((r) => r === role.id)}
                          onChange={(e) =>
                            setAddUser((prev) => {
                              const id = role.id;
                              const isChecked = e.target.checked;
                              const cleanId = prev.roleId.filter(
                                (r) => r !== "",
                              );
                              return {
                                ...prev,
                                roleId: isChecked
                                  ? [...cleanId, id]
                                  : cleanId.filter((r) => r !== id),
                              };
                            })
                          }
                          className="bg-gray-900 cursor-pointer m-1"
                          type="checkbox"
                          key={role.id}
                          value={role.id}
                        />
                      </div>
                    ))
                  : "Oops! Something went wrong!"}
              </div>
              <button
                disabled={
                  !addUser.email ||
                  addUser.roleId.filter((r) => r !== "").length === 0
                }
                type="submit"
                className="flex btn items-center justify-center text-[#ffffff]  bg-[#48765b] rounded-lg m-0.5 p-2.5"
              >
                <AiOutlineUserAdd size={18} />
              </button>
            </div>
          )}
        </form>
      }
    </div>
  );
}

export default GrantAccessComp;
