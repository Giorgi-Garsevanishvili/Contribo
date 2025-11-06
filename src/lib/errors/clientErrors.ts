// lib/utils/clientError.ts
import axios from "axios";

export function getClientErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error))
    return error.response?.data?.message || error.message;
  if (error instanceof Error)
    return error.message;
  return "Unexpected client error.";
}
