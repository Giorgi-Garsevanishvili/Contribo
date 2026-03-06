import { useRef, useState } from "react";
import { useCompAlert } from "./useCompAlert";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function useUpdateData(url: string, data: {}, fetchAction: () => void) {
  const [success, setSuccess] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const { update } = useSession();

  const triggerUpdateData = async () => {
    try {
      if (url === "") {
        triggerCompAlertRef.current({
          message: "Please Provide Proper URL for Update component",
          type: "warning",
          isOpened: true,
        });
        return;
      }
      setIsLoadingUpdate(true);
      setError(null);
      setSuccess(false);

      const response = await axios.put(url, data);

      setSuccess(true);
      setIsLoadingUpdate(false);
      triggerCompAlertRef.current({
        message: response.data.message,
        type: "success",
        isOpened: true,
      });
    } catch (error) {
      setIsLoadingUpdate(false);
      setSuccess(false);
      setError(`${error}`);

      triggerCompAlertRef.current({
        message: `${error}`,
        type: "error",
        isOpened: true,
      });
    } finally {
      const updatedSession = await update();
      if (updatedSession?.user.roles?.includes("RESTRICT")) {
        triggerCompAlertRef.current({
          message: "Your Access Restricted",
          type: "warning",
          isOpened: true,
        });
        return setTimeout(() => {
          redirect("/restricted");
        }, 6000);
      }

      const admin = updatedSession?.user.roles?.includes("ADMIN");

      if (!admin) {
        triggerCompAlertRef.current({
          message: "Your Admin Access Revoked",
          type: "warning",
          isOpened: true,
        });
        return setTimeout(() => {
          redirect("/unauthorized");
        }, 6000);
      }
    }

    if (fetchAction) return fetchAction();
  };

  return { triggerUpdateData, isLoadingUpdate, error, success };
}
