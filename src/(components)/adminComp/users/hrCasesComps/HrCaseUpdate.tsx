import { HrWarningStatus } from "@/generated/enums";
import { useFetchData } from "@/hooks/useDataFetch";
import { useUpdateData } from "@/hooks/useDataUpdate";
import { useEffect, useState } from "react";

type Data = {
  id: string;
  name: string;
  status: string;
  comment: string;
  updatedAt: string | null;
  createdAt: string | null;
  createdBy: { name: string } | null;
  updatedBy: { name: string } | null;
  type: { name: string };
  assignee: {
    name: string;
  };
};

export const CaseUpdateObj = {
  name: "",
  comment: "",
  status: "",
  typeId: "",
};

function HrCaseUpdate({
  refetch,
  id,
  extraData1,
}: {
  refetch: () => void;
  id: string;
  extraData1?: Data[];
}) {
  const [updateData, setUpdateData] = useState(CaseUpdateObj);
  const [validatedData, setValidatedData] = useState({});

  const { triggerUpdateData, isLoadingUpdate } = useUpdateData(
    `/api/admin/hrWarnings/${id}`,
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
      className={`flex bg-gray-100/70 p-4 rounded-lg mx-2 flex-col  lg:flex-row grow items-start justify-between`}
    >
      {isLoadingUpdate ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold animate-spin">.</h3>
        </div>
      ) : (
        <form
          onSubmit={triggerUpdateData}
          className="flex md:flex-row flex-col"
        >
          <div className="flex flex-col">
            <label className="ml-3" htmlFor="name">
              Name
            </label>
            <div className="flex grow">
              <input
                value={updateData.name}
                onChange={(e) =>
                  setUpdateData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input-def p-1.5 bg-gray-400/95 border-white text-white rounded-sm grow"
                type="text"
                name="name"
                id="name"
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col grow  bg-gray-400/95 p-2 m-2 rounded-lg">
              <div className="flex flex-col  text-white grow">
                <label className="px-3 flex" htmlFor="comment">
                  Comment
                  <h2 className="italic ml-2 text-gray-300">Max: 150 word</h2>
                </label>
                <input
                  onChange={(e) =>
                    setUpdateData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  value={updateData.comment}
                  className="input-def  wrap-break-word text-wrap rounded-sm grow border-white"
                  type="text"
                  maxLength={150}
                  name="comment"
                  id="comment"
                  placeholder="Comment"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col grow">
            <div className="flex flex-col">
              <label className="ml-3" htmlFor="type">
                Type
              </label>
              <select
                onChange={(e) =>
                  setUpdateData((prev) => ({ ...prev, typeId: e.target.value }))
                }
                value={updateData.typeId}
                className="grow border-2 m-1 rounded-md p-1.5  bg-gray-400/95 text-white"
                name="type"
                id="type"
              >
                <option value={""}></option>
                {extraData1?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="ml-3" htmlFor="status">
                Status
              </label>
              <select
                onChange={(e) =>
                  setUpdateData((prev) => ({ ...prev, status: e.target.value }))
                }
                value={updateData.status}
                className="grow border-2 m-1 rounded-md p-1.5 bg-gray-400/95 text-white"
                name="status"
                id="status"
              >
                <option value={""}></option>
                {Object.values(HrWarningStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={
                isLoadingUpdate ||
                Object.values(validatedData).every((val) => val === "")
              }
              type="submit"
              className={`btn bg-green-900 text-white`}
            >
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default HrCaseUpdate;
