import { handleError } from "@/lib/errors/handleErrors";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCompAlert } from "./useCompAlert";

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

function usePaginatedData<T>(
  url: string,
  initialData: T,
  dependencies?: unknown,
) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationMeta | null>();

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error && error.name === "CanceledError") {
          setIsLoading(true);
          return;
        }
        setError(true);
        triggerCompAlertRef.current({
          message: `${error}`,
          type: "error",
          isOpened: true,
        });
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
      setIsLoading(false);
    } catch (error) {
      setError(true);
      if (error instanceof Error && error.name === "CanceledError") {
        setIsLoading(true);
        return;
      }
      triggerCompAlertRef.current({
        message: `${error}`,
        type: "error",
        isOpened: true,
      });
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, pagination, refetch };
}

export default usePaginatedData;
