import { useDeleteData } from "@/hooks/useDeleteData";

function HrCaseDeleteButton({
  url,
  fetchAction,
  extraTXT,
}: {
  url: string;
  fetchAction?: () => void;
  extraTXT?: string;
}) {
  const { deleteData, isLoadingDelete } = useDeleteData(url, fetchAction);

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
