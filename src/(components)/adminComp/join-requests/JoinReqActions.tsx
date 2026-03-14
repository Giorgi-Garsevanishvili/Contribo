import { ReqStatus } from "@/generated/enums";
import { useCompAlert } from "@/hooks/useCompAlert";
import { useConfirmTab } from "@/hooks/useConfirmTab";
import { useUpdateData } from "@/hooks/useDataUpdate";
import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { GiSandsOfTime } from "react-icons/gi";
import { ImSpinner9 } from "react-icons/im";
import { IoClose } from "react-icons/io5";

function JoinReqActions({
  currentStatus,
  id,
  refetch,
}: {
  currentStatus: ReqStatus;
  id: string;
  refetch: () => void;
}) {
  const [validatedData, setValidatedData] = useState<{ status: ReqStatus }>({
    status: currentStatus,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const { ask } = useConfirmTab();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const { triggerUpdateData, isLoadingUpdate } = useUpdateData(
    `/api/admin/joinRequests/${id}`,
    validatedData,
    refetch,
  );

  useEffect(() => {
    if (validatedData.status === currentStatus) {
      setIsLoading(false);
      return;
    }
    triggerUpdateData();
    setIsLoading(false);
  }, [validatedData]);

  const handleAction = async ({ NewStatus }: { NewStatus: ReqStatus }) => {
    setIsLoading(true);
    const confirmed = await ask({
      title: "Would You Like To Change Status To:",
      value: `${NewStatus}`,
      message: "Please Double Check Your Action!",
    });

    if (!confirmed) {
      setIsLoading(false);
      return;
    }
    setValidatedData({ status: NewStatus });
  };

  return (
    <>
      {isLoading || isLoadingUpdate ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-2 justify-center">
          <ImSpinner9 className="animate-spin" size={20} />
        </div>
      ) : (
        <>
          <button
            onClick={() => handleAction({ NewStatus: "APPROVED" })}
            className="btn h-fit hover:opacity-30 p-1.5 border border-green-800 bg-green-500/20  m-0 rounded-sm w-full md:w-fit"
          >
            <FaCheck size={15} />
          </button>
          <button
            onClick={() => handleAction({ NewStatus: "REJECTED" })}
            className="btn h-fit hover:opacity-30 p-1.5 border border-red-800 bg-red-500/20 m-0 rounded-sm w-full md:w-fit"
          >
            <IoClose size={15} />
          </button>
          {currentStatus === "PENDING" ? (
            " "
          ) : (
            <button
              onClick={() => handleAction({ NewStatus: "PENDING" })}
              className="btn h-fit hover:opacity-30 p-1.5 border border-orange-800 bg-orange-500/20 m-0 rounded-sm w-full md:w-fit"
            >
              <GiSandsOfTime size={15} />
            </button>
          )}
        </>
      )}
    </>
  );
}

export default JoinReqActions;
