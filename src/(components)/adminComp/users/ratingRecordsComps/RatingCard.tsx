import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import DeleteButtonAdmin from "../DeleteButtonAdmin";

type Data = {
  id: string;
  action: "INCREASE" | "DECREASE";
  createdBy: { name: string } | null;
  updatedBy: { name: string } | null;
  createdAt: string;
  updatedAt: string;
  newValue: number;
  oldValue: number;
  reason: string;
  user: { name: string } | null;
  value: number;
};

type DataType = {
  createdAt: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}[];

export const RATING_ACTION_COLORS = {
  DECREASE: {
    bg: "bg-red-100",
    border: "border-red-300",
    shadow: "shadow-red-200",
  },
  INCREASE: {
    bg: "bg-green-100",
    border: "border-green-300",
    shadow: "shadow-green-200",
  },
} as const;

function RatingCard({
  item,
  isOpenId,
  onEdit,
  setIsOpenId,
  setOnEdit,
  refetch,
}: {
  item: Data;
  isOpenId: string;
  onEdit: string;
  setIsOpenId: (id: string) => void;
  setOnEdit: (id: string) => void;
  refetch: () => void;
}) {
  const actionKey = item.action as keyof typeof RATING_ACTION_COLORS;
  const actionColors = RATING_ACTION_COLORS[actionKey];

  return (
    <div
      className={`flex ${actionColors.border} border flex-col transition-all duration-300 shadow-sm rounded-2xl m-1 p-0 justify-between w-full bg-gray-100/85`}
      key={item.id}
    >
      <button
        onClick={() => (
          setIsOpenId(isOpenId !== item.id ? item.id : ""),
          setOnEdit("")
        )}
        className={`flex lg:flex-row  flex-col px-5 py-1.5 md:text-sm text-xs btn justify-between transition-all duration-300 w-full m-0 ${actionColors ? `${actionColors.shadow} ${actionColors.bg}` : ""} border shadow-lg mb-2`}
      >
        <h3>
          <strong>User: </strong> {item.user?.name}
        </h3>
        <h3>
          <strong>Reason: </strong> {item.reason}
        </h3>
        <h3>
          <strong>Action: </strong> {item.action}
        </h3>
        {isOpenId === item.id ? (
          <FaAngleUp className="animate-pulse" size={22} />
        ) : (
          <FaAngleDown className="animate-pulse" size={22} />
        )}
      </button>
      <div
        className={`${isOpenId === item.id ? "flex" : "hidden"} lg:flex-row flex-col w-full  items-center justify-center`}
      >
        <div className="flex  lg:flex-row flex-col w-full items-center justify-start p-3">
          <div
            className={`flex flex-col grow ${actionColors ? `${actionColors.border} ${actionColors.bg}` : ""} border rounded-lg  md:flex-row flex-col items-center justify-center lg:py-10 w-full lg:px-10 p-4 m-2 gap-2`}
          >
            <div className="flex-col w-full flex">
              <h3>
                <strong>Action: </strong>
                {item.action}
              </h3>
              <h3>
                <strong>Created At: </strong>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : "No Data"}
              </h3>
              <h3>
                <strong>Updated At: </strong>
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleString()
                  : "No Data"}
              </h3>
            </div>
            <div className="flex-col w-full flex">
              <h3>
                <strong>Reason: </strong>
                {item.reason}
              </h3>
              <h3>
                <strong>Created By: </strong>
                {item.createdBy?.name ?? "No Data"}
              </h3>
              <h3>
                <strong>Updated By: </strong>
                {item.updatedBy?.name ?? "No Data"}
              </h3>
            </div>
            <div className="flex-col w-full flex">
              <h3>
                <strong>Old Score: </strong>
                {item.oldValue}
              </h3>
              <h3>
                <strong>Entered Score: </strong>
                {item.newValue}
              </h3>
              <h3>
                <strong>End Score: </strong>
                {item.value}
              </h3>
            </div>
          </div>
          {/* <div className={`${onEdit === item.id ? "flex" : "hidden"}`}>
                  <HrCaseUpdate
                    refetch={refetch}
                    id={item.id}
                    extraData1={types}
                  />
                </div> */}
        </div>
        <div className="flex p-1 md:m-4  lg:flex-col">
          <DeleteButtonAdmin
            url={`/api/admin/ratingHistory/${item.id}`}
            fetchAction={refetch}
            value={`${item.action} with value of ${item.value} for ${item.user?.name}`}
          />
          <button
            onClick={() => {
              setOnEdit(onEdit === item.id ? "" : isOpenId);
            }}
            className={`btn grow`}
          >
            {onEdit === item.id ? "Close" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatingCard;
