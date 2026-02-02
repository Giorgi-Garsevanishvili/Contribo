import { useDeleteData } from "@/hooks/useDeleteData";

function HrCaseDeleteButton({ url, fetchAction }: { url: string, fetchAction?: () => void }) {
  const { deleteData, isLoadingDelete } = useDeleteData(url, fetchAction);

  return (
    <button
      onClick={deleteData}
      className={`${isLoadingDelete ? "animate-pulse" : ""} btn grow bg-red-800 text-white `}
    >
      Delete
    </button>
  );
}

export default HrCaseDeleteButton;
