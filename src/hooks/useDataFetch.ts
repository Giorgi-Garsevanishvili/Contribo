import { useEffect, useRef, useState } from "react";
import { useCompAlert } from "./useCompAlert";
import axios from "axios";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { responseLogOut } from "@/lib/ResponseLogOut";

export function useFetchData<T>(url: string, dependencies: unknown[] = []) {
  const [data, setData] = useState<T>();
  const [success, setSuccess] = useState(false);
  const [pagination, setPagination] = useState();
  const [isLoadingFetch, setIsLoadingFetch] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const fetchData = async () => {
      abortControllerRef.current = new AbortController();
      try {
        setIsLoadingFetch(true);
        setError(null);
        setSuccess(false);
        const response = await axios.get(url, {
          signal: abortControllerRef.current.signal,
        });

        const responseData = response.data?.records || response.data;
        setData(responseData.data || responseData);
        if (responseData.pagination) {
          setPagination(responseData.pagination);
        }

        setSuccess(true);
        setIsLoadingFetch(false);
      } catch (error) {
        setIsLoadingFetch(false);
        setSuccess(false);
        if (error instanceof Error && error.name === "CanceledError") {
          setIsLoadingFetch(true);
          return;
        }
        setError(`${error}`);
        const message = getClientErrorMessage(error);
        triggerCompAlertRef.current({
          message: `${message}`,
          type: "error",
          isOpened: true,
        });

       responseLogOut({ message: message });
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, ...dependencies]);

  const refetch = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    try {
      abortControllerRef.current = new AbortController();
      setIsLoadingFetch(true);
      setError(null);
      setSuccess(false);
      const response = await axios.get(url, {
        signal: abortControllerRef.current.signal,
      });
      const responseData = response.data?.records || response.data;
      setData(responseData.data || responseData);
      if (responseData.pagination) {
        setPagination(responseData.pagination);
      }

      setSuccess(true);
      setIsLoadingFetch(false);
    } catch (error) {
      setIsLoadingFetch(false);
      setSuccess(false);
      setError(`${error}`);
      if (error instanceof Error && error.name === "CanceledError") {
        setIsLoadingFetch(true);
        return;
      }
      const message = getClientErrorMessage(error);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });

      responseLogOut({ message: message });
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  };

  return { data, isLoadingFetch, error, refetch, success };
}
