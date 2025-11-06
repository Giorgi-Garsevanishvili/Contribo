import axios from "axios";
import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

type DeleteMethod = "allowedUser" | "user" | "region" | "role";

type DeleteButtonProps = {
  method: DeleteMethod;
  id: string | undefined;
  disabled?: boolean;
  onDelete?: () => void;
};

const deleteAllowedUser = async (id: string | undefined) => {
  try {
    await axios.delete(`/api/console/allowed-users/${id}`);
  } catch (error) {
    console.log(error);
    return;
  }
};

function DeleteButton({ method, id, disabled, onDelete }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    try {
      switch (method) {
        case "allowedUser":
          setLoading(true);
          await deleteAllowedUser(id);
          if (onDelete) onDelete();
          setLoading(false);
          break;

        default:
          break;
      }
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
      className={`btn flex flex-grow justify-center items-center bg-red-900 rounded-lg  m-0 ${
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
