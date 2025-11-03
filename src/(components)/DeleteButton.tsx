import React from "react";
import { MdDeleteOutline } from "react-icons/md";

type DeleteButtonProps = {
  onDelete: () => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
};

function DeleteButton({ onDelete, loading, disabled }: DeleteButtonProps) {
  return (
    <button
      onClick={onDelete}
      disabled={loading || disabled}
      className={`btn bg-red-900 rounded-lg p-1 m-0 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <span className="loader border-t-transparent border-white border-2 rounded-full w-4 h-4 animate-spin" />
      ) : (
        <MdDeleteOutline size={18} />
      )}
    </button>
  );
}

export default DeleteButton;
