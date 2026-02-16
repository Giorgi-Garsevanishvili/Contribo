import { useDeleteData } from "@/hooks/useDeleteData";

function HrCaseDeleteButton({
  url,
  fetchAction,
  extraTXT,
  value
}: {
  url: string;
  fetchAction?: () => void;
  extraTXT?: string;
  value:string
}) {
  const { deleteData, isLoadingDelete } = useDeleteData(
    url,
    "Would you like to delete",
    value,
    "Action is permanent!",
    fetchAction,
  );

  return (
    <button
      onClick={deleteData}
      className={`${isLoadingDelete ? "animate-pulse" : ""} btn grow bg-red-800 text-white `}
    >
      {extraTXT ? `Delete ${extraTXT}` : "Delete"}
    </button>
  );
}

export default HrCaseDeleteButton;
