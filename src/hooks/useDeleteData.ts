import { useRef, useState } from "react";
import { useCompAlert } from "./useCompAlert";
import axios from "axios";

export function useDeleteData<T>(url: string, fetchAction?: () => void) {
  const [success, setSuccess] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const deleteData = async () => {
    try {
      setIsLoadingDelete(true);
      setError(null);
      setSuccess(false);
      const response = await axios.delete(url);
      console.log(response.data.message);

      setSuccess(true);
      setIsLoadingDelete(false);
      triggerCompAlertRef.current({
        message: response.data.message,
        type: "success",
        isOpened: true,
      });
      if(fetchAction) return fetchAction()
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
