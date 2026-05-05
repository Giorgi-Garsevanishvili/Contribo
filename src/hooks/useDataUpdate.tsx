import { useRef, useState } from "react";
import { useCompAlert } from "./useCompAlert";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { responseLogOut } from "@/lib/ResponseLogOut";

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
      triggerCompAlertRef.current({
        message: response.data.message,
        type: "success",
        isOpened: true,
      });

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

      if (fetchAction) return fetchAction();
    } catch (error) {
      setSuccess(false);
      setError(`${error}`);
      const message = getClientErrorMessage(error);

      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });

      responseLogOut({ message: message });
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  return { triggerUpdateData, isLoadingUpdate, error, success };
}
