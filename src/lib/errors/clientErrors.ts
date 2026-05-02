import axios from "axios";

export function getClientErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // If message is already a string, return it directly
    if (typeof data?.message === "string") {
      return data.message;
    }

    // If message is an object with validation errors
    if (typeof data?.message === "object" && data?.message !== null) {
      const messages: string[] = [];

      Object.values(data.message).forEach((err: any) => {
        if (typeof err === "string") {
          messages.push(err);
        } else if (Array.isArray(err)) {
          err.forEach((e: any) => {
            if (typeof e?.message === "string") {
              messages.push(e.message);
            } else if (typeof e === "string") {
              messages.push(e);
            }
          });
        } else if (typeof err?.message === "string") {
          messages.push(err.message);
        }
      });

      if (messages.length > 0) {
        return messages.join("; ");
      }
    }

    // Fallback to axios error message
    return error.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}