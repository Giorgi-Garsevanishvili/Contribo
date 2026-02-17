import { useRef, useState } from "react";
import { useCompAlert } from "./useCompAlert";
import axios from "axios";
import { useConfirmTab } from "./useConfirmTab";
import { signOut } from "next-auth/react";

export function useDeleteData<T>(
  url: string,
  title: string,
  value: string,
  message: string,
  fetchAction?: () => void,
) {
  const [success, setSuccess] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const { ask } = useConfirmTab();

  const deleteData = async () => {
    try {
      if (url === "") {
        return triggerCompAlertRef.current({
          message: `Provide valid API path.`,
          type: "warning",
          isOpened: true,
        });
      }

      setIsLoadingDelete(true);
      setError(null);
      setSuccess(false);
      const confirmed = await ask({
        title,
        value,
        message,
      });

      if (!confirmed) {
        setIsLoadingDelete(false);
        return;
      }
      const response = await axios.delete(url);

      setSuccess(true);
      setIsLoadingDelete(false);
      triggerCompAlertRef.current({
        message: response.data.message,
        type: "success",
        isOpened: true,
      });
      if (response.data.logOut) {
       return setTimeout(async () => {
          await signOut({ callbackUrl: "/" });
        }, 4000);
      }
      if (fetchAction) return fetchAction();
    } catch (error) {
      setIsLoadingDelete(false);
      setSuccess(false);
      setError(`${error}`);

      triggerCompAlertRef.current({
        message: `${error}`,
        type: "error",
        isOpened: true,
      });
    }
  };

  return { deleteData, isLoadingDelete, error, success };
}
