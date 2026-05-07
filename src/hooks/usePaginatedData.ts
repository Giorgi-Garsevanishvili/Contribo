import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useCompAlert } from "./useCompAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { responseLogOut } from "@/lib/ResponseLogOut";

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type CountsType = {
  availabilityCounts: number;
  totalDuration: string;
};

function usePaginatedData<T>(
  url: string,
  initialData: T,
  stopFetch?: boolean | null,
  dependencies?: unknown
) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationMeta | null>();
  const [counts, setCounts] = useState<CountsType | null>();

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!url || stopFetch) return;


        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        setError(false);
        const response = await axios.get(url, {
          signal: abortControllerRef.current.signal,
        });
        const responseData = response.data?.records || response.data;
        setData(responseData.data || responseData);
        if (responseData.pagination) {
          setPagination(responseData.pagination);
        }
        if (responseData.counts) {
          setCounts(responseData.counts);
        }
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error && error.name === "CanceledError") {
          setIsLoading(true);
          return;
        }
        setError(true);
        const message = getClientErrorMessage(error);

        triggerCompAlertRef.current({
          message: `${message}`,
          type: "error",
          isOpened: true,
        });

        responseLogOut({ message: message });

        setIsLoading(false);
      }
    };
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, dependencies]);

  const refetch = async () => {
    try {
      if (!url) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(false);
      const response = await axios.get(url, {
        signal: abortControllerRef.current.signal,
      });
      const responseData = response.data?.records || response.data;
      setData(responseData.data || responseData);
      if (responseData.pagination) {
        setPagination(responseData.pagination);
      }
      if (responseData.counts) {
        setCounts(responseData.counts);
      }
      setIsLoading(false);
    } catch (error) {
      setError(true);
      if (error instanceof Error && error.name === "CanceledError") {
        setIsLoading(true);
        return;
      }
      const message = getClientErrorMessage(error);

      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });

      responseLogOut({ message: message });
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, pagination, refetch, counts };
}

export default usePaginatedData;
