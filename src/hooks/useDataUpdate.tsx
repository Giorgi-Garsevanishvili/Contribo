import { useRef, useState } from "react";
import { useCompAlert } from "./useCompAlert";
import axios from "axios";

export function useUpdateData(url: string, data: {}, fetchAction: () => void) {
  const [success, setSuccess] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

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
      if (fetchAction) return fetchAction();
    } catch (error) {
      setIsLoadingUpdate(false);
      setSuccess(false);
      setError(`${error}`);

      triggerCompAlertRef.current({
        message: `${error}`,
        type: "error",
        isOpened: true,
      });
    }
  };

  return { triggerUpdateData, isLoadingUpdate, error, success };
}
