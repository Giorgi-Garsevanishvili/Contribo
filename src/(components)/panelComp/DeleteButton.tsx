"use client";
import { useCompAlert } from "@/hooks/useCompAlert";
import { useConfirmTab } from "@/hooks/useConfirmTab";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

export type DeleteMethod =
  | "allowedUser"
  | "region"
  | "role"
  | "eventRoles"
  | "hrWarningsType"
  | "memberStatus"
  | "position";

type DeleteButtonProps = {
  method: DeleteMethod;
  id: string | undefined;
  disabled?: boolean;
  value?: string;
  onDelete?: () => void;
};

function DeleteButton({
  method,
  id,
  disabled,
  onDelete,
  value,
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const { ask } = useConfirmTab();

  const deleteUrl = () => {
    switch (method) {
      case "allowedUser":
        return "allowed-users";

      case "eventRoles":
        return "event-roles";

      case "hrWarningsType":
        return "hr-warning-type";

      case "memberStatus":
        return "member-status";

      case "position":
        return "positions";

      case "region":
        return "regions";

      case "role":
        return "roles";

      default:
        break;
    }
  };

  const handleDelete = async () => {
    const deleteURL = deleteUrl();
    try {
      setLoading(true);
      const confirmed = await ask({
        title: `Would you like to delete`,
        value: `${value?.toUpperCase() || method.toUpperCase()}?`,
        message: `${
          method.includes("allowedUser")
            ? `By Deleting user all related data will permanently delete.`
            : "Action is permanent!"
        }`,
      });

      if (!confirmed) {
        setLoading(false);
        return;
      }
      const res = await axios.delete(`/api/console/${deleteURL}/${id}`);
      const signOutReq = res.data.requiresSignOut === true;
      if (signOutReq) {
        setTimeout(async () => {
          await signOut({ callbackUrl: "/" });
          return;
        }, 4000);
      }

      triggerCompAlert({
        message: signOutReq
          ? "Your Account Deleted"
          : `${method.toUpperCase()} Deleted`,
        type: "success",
        isOpened: true,
      });
      if (onDelete) onDelete();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errorMessage = getClientErrorMessage(error);
      triggerCompAlert({
        message: `Failed to delete ${method.toUpperCase()}. error: ${errorMessage}`,
        type: "error",
        isOpened: true,
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading || disabled}
      className={`btn flex flex-grow justify-center items-center bg-[#E74C3C] rounded-lg m-1 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <span className="loader border-t-transparent border-white border-2 rounded-full w-4 h-4 animate-spin" />
      ) : (
        <MdDeleteOutline size={20} />
      )}
    </button>
  );
}

export default DeleteButton;
