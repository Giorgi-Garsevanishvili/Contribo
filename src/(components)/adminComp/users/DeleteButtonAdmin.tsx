import { useDeleteData } from "@/hooks/useDeleteData";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { ClassNameValue } from "tailwind-merge";

function DeleteButtonAdmin({
  url,
  fetchAction,
  extraTXT,
  value,
  styleClass,
  message,
}: {
  url: string;
  fetchAction?: () => void;
  extraTXT?: string;
  value: string;
  styleClass: ClassNameValue;
  message?: string;
}) {
  const { deleteData, isLoadingDelete } = useDeleteData(
    url,
    "Would you like to delete",
    value,
    message || "Action is permanent!",
    fetchAction,
  );

  return (
    <button
      type="button"
      onClick={deleteData}
      className={`${isLoadingDelete ? "animate-pulse" : ""} btn ${styleClass}`}
    >
      {extraTXT ? (
        <>
          {" "}
          <RiDeleteBin6Fill size={22} className="mr-2" /> {extraTXT}
        </>
      ) : (
        <RiDeleteBin6Fill size={22} />
      )}
    </button>
  );
}

export default DeleteButtonAdmin;
