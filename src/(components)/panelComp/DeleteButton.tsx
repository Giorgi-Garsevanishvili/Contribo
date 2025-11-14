import { useCompAlert } from "@/hooks/useCompAlert";
import axios from "axios";
import React, { useState } from "react";
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
  onDelete?: () => void;
};

function DeleteButton({ method, id, disabled, onDelete }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const { triggerCompAlert } = useCompAlert();

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

  const DeleteData = async (id: string | undefined) => {
    const deleteURL = deleteUrl()
    try {
      await axios.delete(`/api/console/${deleteURL}/${id}`);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await DeleteData(id);
      triggerCompAlert({
        message: `${method} Deleted`,
        type: "success",
        isOpened: true,
      });
      if (onDelete) onDelete();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(`Failed to delete ${method}:`, error);
      alert(`Failed to delete ${method}`);
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
