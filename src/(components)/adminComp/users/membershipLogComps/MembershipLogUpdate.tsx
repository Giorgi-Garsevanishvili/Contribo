import { useUpdateData } from "@/hooks/useDataUpdate";
import { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";

export const CaseUpdateObj = {
  startedAt: "",
  endedAt: "",
  ended: false,
};

function MembershipUpdate({
  refetch,
  id,
  ended,
}: {
  refetch: () => void;
  id: string;
  ended: boolean;
}) {
  const [updateData, setUpdateData] = useState(CaseUpdateObj);
  const [validatedData, setValidatedData] = useState({});

  const { triggerUpdateData, isLoadingUpdate } = useUpdateData(
    `/api/admin/memberStatusLog/${id}`,
    validatedData,
    refetch,
  );

  useEffect(() => {
    const validated = Object.entries(updateData).reduce(
      (acc, [key, value]) => {
        if (value !== "" && value !== false) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string | boolean>,
    );

    setValidatedData(validated);
  }, [updateData]);

  return (
    <div
      className={`flex bg-gray-100/70 p-4 rounded-lg md:mb-5 mx-2 flex-col  lg:flex-row grow items-start justify-between`}
    >
      {isLoadingUpdate ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <ImSpinner9 className="animate-spin" size={40} />
        </div>
      ) : (
        <form
          onSubmit={triggerUpdateData}
          className="flex md:flex-row grow flex-col"
        >
          <div className="flex flex-col">
            <div className="flex flex-col grow  bg-gray-400/95 p-1 m-1 rounded-lg">
              <div className="flex md:flex-row flex-col  text-gray-100">
                <div className="flex flex-col grow">
                  <label className="ml-3" htmlFor="start">
                    Start Date
                  </label>
                  <input
                    value={updateData.startedAt}
                    onChange={(e) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        startedAt: e.target.value,
                      }))
                    }
                    className="input-def  bg-gray-400/95 border-white text-white rounded-sm grow"
                    type="datetime-local"
                    name="start"
                    id="start"
                    placeholder="Start Date"
                  />
                </div>
                <div className="flex flex-col grow">
                  <label className="ml-3" htmlFor="end">
                    End Date
                  </label>
                  <input
                    value={updateData.endedAt ? updateData.endedAt : ""}
                    onChange={(e) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        endedAt: e.target.value,
                      }))
                    }
                    className="input-def  bg-gray-400/95 border-white text-white rounded-sm grow"
                    type="datetime-local"
                    name="end"
                    id="end"
                    placeholder="End Date"
                  />
                </div>
              </div>

              {ended ? null : (
                <div className=" flex flex-col rounded-md border items-start m-2 py-1 px-2 justify-center gap-2 bg-gray-200 text-gray-950">
                  <p className="">ENDED</p>
                  <div className="flex border border-gray-500/20 p-2 rounded-md gap-3">
                    <input
                      className="border rounded-sm"
                      type="checkbox"
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          ended: e.target.checked,
                        }))
                      }
                      name="ended"
                      id="ended"
                    />
                    <p className="italic text-red-900/80">
                      By Updating Membership As Ended, You are closing current
                      record and it can`t be updated later.{" "}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              disabled={
                isLoadingUpdate ||
                Object.values(validatedData).every((val) => val === "")
              }
              type="submit"
              className={`btn w-full m-0 mt-1 bg-green-900 text-white`}
            >
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MembershipUpdate;
