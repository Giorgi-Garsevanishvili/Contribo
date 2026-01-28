import { useEffect, useRef, useState } from "react";
import { useCompAlert } from "./useCompAlert";
import axios from "axios";

export function useFetchData<T>(url: string, dependencies: unknown[] = []) {
  const [data, setData] = useState<T>();
  const [success, setSuccess] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingFetch(true);
        setError(null);
        setSuccess(false);
        const response = await axios.get(url);
        setData(response.data.data);
        setSuccess(true);
        setIsLoadingFetch(false);
      } catch (error) {
        setIsLoadingFetch(false);
        setSuccess(false);
        setError(`${error}`);
        triggerCompAlertRef.current({
          message: `${error}`,
          type: "error",
          isOpened: true,
        });
      }
    };

    fetchData();
  }, [url, ...dependencies]);

  const refetch = async () => {
    try {
      setIsLoadingFetch(true);
      setError(null);
      setSuccess(false);
      const response = await axios.get(url);
      setData(response.data.data);
      setSuccess(true);
      setIsLoadingFetch(false);
    } catch (error) {
      setIsLoadingFetch(false);
      setSuccess(false);
      setError(`${error}`);
      triggerCompAlertRef.current({
        message: `${error}`,
        type: "error",
        isOpened: true,
      });
    }
  };

  return { data, isLoadingFetch, error, refetch, success };
}
