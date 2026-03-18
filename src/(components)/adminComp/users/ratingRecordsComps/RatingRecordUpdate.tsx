import { useUpdateData } from "@/hooks/useDataUpdate";
import { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";

export const CaseUpdateObj = {
  reason: "",
};

function RatingUpdate({ refetch, id }: { refetch: () => void; id: string }) {
  const [updateData, setUpdateData] = useState(CaseUpdateObj);
  const [validatedData, setValidatedData] = useState({});

  const { triggerUpdateData, isLoadingUpdate } = useUpdateData(
    `/api/admin/ratingHistory/${id}`,
    validatedData,
    refetch,
  );

  useEffect(() => {
    const validated = Object.entries(updateData).reduce(
      (acc, [key, value]) => {
        if (value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    setValidatedData(validated);
  }, [updateData]);

  return (
    <div
      className={`flex bg-gray-100/70 p-4 rounded-lg mx-2 flex-row grow items-start justify-between`}
    >
      {isLoadingUpdate ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <ImSpinner9 className="animate-spin" size={40} />
        </div>
      ) : (
        <form
          onSubmit={triggerUpdateData}
          className="flex items-center justify-center grow flex-row"
        >
          <div className="flex flex-col">
            <div className="flex flex-col grow  bg-gray-400/95 p-2 m-2 rounded-lg">
              <div className="flex flex-col  text-white grow">
                <label className="px-3 flex" htmlFor="comment">
                  Reason
                  <h2 className="italic ml-2 text-gray-300">Max: 150 word</h2>
                </label>
                <input
                  onChange={(e) =>
                    setUpdateData((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  value={updateData.reason}
                  className="input-def  wrap-break-word text-wrap rounded-sm grow border-white"
                  type="text"
                  maxLength={150}
                  name="reason"
                  id="reason"
                  placeholder="Reason"
                />
              </div>
            </div>

            <button
              disabled={
                isLoadingUpdate ||
                Object.values(validatedData).every((val) => val === "")
              }
              type="submit"
              className={`btn w-full m-0 mt-2 bg-green-900 text-white`}
            >
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default RatingUpdate;
