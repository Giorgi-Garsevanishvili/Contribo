"use client";
import { useCompAlert } from "@/hooks/useCompAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";

function UpdatePhoto({ parentRefetch }: { parentRefetch: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const {update} = useSession()

  const handlePhotoSync = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/user/syncPhotoGoogle");

      triggerCompAlertRef.current({
        message: `${response.data.message}`,
        type: "success",
        isOpened: true,
      });
    
      parentRefetch();
      update()
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
    <button
      onClick={() => handlePhotoSync()}
      type="button"
      name="update-Photo"
      disabled={isLoading}
      className={`${isLoading ? "loader animate-pulse" : ""} items-center cursor-pointer hover:opacity-70 transition-all duration-300 ease-out w-full flex p-1 px-2 justify-center gap-1 rounded-sm bg-black text-white`}
    >
      <FcGoogle size={20} />
      <h3 className="flex grow items-center text-sm justify-center">
        {isLoading ? "Syncing..." : "Sync photo from Google"}
      </h3>
    </button>
  );
}

export default UpdatePhoto;
