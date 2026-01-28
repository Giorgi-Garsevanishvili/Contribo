import { ParamValue } from "next/dist/server/request/params";
import { FormEvent, useRef, useState } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { useCompAlert } from "@/hooks/useCompAlert";

type UserUpdate = {
  name: string;
  email: string;
};

const userUpdateObj = {
  name: "",
  email: "",
} as UserUpdate;

function UserUpdate({ id, refetch }: { id: ParamValue; refetch: () => void }) {
  const [userUpdate, setUserUpdate] = useState<UserUpdate>(userUpdateObj);
  const [isLoading, setIsLoading] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const updateUser = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (userUpdate.email === "" && userUpdate.name === "") {
        setIsLoading(false);
        return triggerCompAlertRef.current({
          message: `At least one field should be provided`,
          type: "error",
          isOpened: true,
        });
      }

      const payload: Partial<UserUpdate> = {};

      if (userUpdate.name && userUpdate.name !== "") {
        payload.name = userUpdate.name;
      }

      if (userUpdate.email && userUpdate.email !== "") {
        payload.email = userUpdate.email;
      }

      const res = await axios.put(`/api/admin/users/${id}`, payload);

      const signOutReq = res.data.requiresSignOut === true;
      if (signOutReq) {
        setTimeout(async () => {
          await signOut({ callbackUrl: "/" });
        }, 4000);
      }

      triggerCompAlert({
        message: signOutReq
          ? "Your account updated please sign in again!"
          : `User Updated`,
        type: signOutReq ? "warning" : "success",
        isOpened: true,
      });

      setIsLoading(false);
      setUserUpdate(userUpdateObj);
      if (!signOutReq) {
        refetch();
      }
    } catch (error) {
      const message = getClientErrorMessage(error);
      setIsLoading(false);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });
    }
    return;
  };

  return (
    <form
      onSubmit={updateUser}
      className={`flex flex-col justify-center items-center`}
    >
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <input
            type="text"
            id="name"
            className="input-def p-2 m-1 w-full bg-gray-400/95 border-white text-white rounded-sm flex-grow"
            value={userUpdate.name}
            onChange={(e) =>
              setUserUpdate((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Name"
          />
          <input
            id="email"
            type="email"
            className="input-def p-2 m-1 w-full  bg-gray-400/95 border-white text-white rounded-sm flex-grow"
            value={userUpdate.email}
            onChange={(e) =>
              setUserUpdate((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            placeholder="Email"
          />
          <button
            type="submit"
            disabled={!userUpdate.email && !userUpdate.name}
            className="btn flex-grow bg-[#48765b] text-white w-full"
          >
            Update User
          </button>
        </>
      )}
    </form>
  );
}

export default UserUpdate;
