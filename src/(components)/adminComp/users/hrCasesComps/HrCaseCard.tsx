import HrCaseUpdate from "./HrCaseUpdate";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import DeleteButtonAdmin from "../DeleteButtonAdmin";
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

type DataType = {
  createdAt: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}[];

export const WARNING_STATUS_COLORS = {
  ACTIVE: {
    bg: "bg-[#00aeef]/20",
    border: "border-[#00aeef]",
    shadow: "shadow-[#00aeef]",
  },
  UNDER_REVIEW: {
    bg: "bg-[#f47b20]/20",
    border: "border-[#f47b20]",
    shadow: "shadow-[#f47b20]",
  },
  ESCALATED: {
    bg: "bg-[#ec008c]/20",
    border: "border-[#ec008c]",
    shadow: "shadow-[#ec008c]",
  },
  APPROVED: {
    bg: "bg-[#7ac143]/20",
    border: "border-[#7ac143]",
    shadow: "shadow-[#7ac143]",
  },
  RESOLVED: {
    bg: "bg-[#2e3192]/20",
    border: "border-[#2e3192]",
    shadow: "shadow-[#2e3192]",
  },
  CANCELLED: {
    bg: "bg-black/20",
    border: "border-black",
    shadow: "shadow-black",
  },
  EXPIRED: {
    bg: "bg-gray-400/20",
    border: "border-gray-400",
    shadow: "shadow-gray-300",
  },
  ARCHIVED: {
    bg: "bg-slate-100/20",
    border: "border-slate-300",
    shadow: "shadow-slate-200",
  },
} as const;

const TYPE_ORDER = [
  "ACTIVE",
  "UNDER_REVIEW",
  "ESCALATED",
  "APPROVED",
  "RESOLVED",
  "EXPIRED",
  "CANCELLED",
  "ARCHIVED",
];

function HrCaseCard({
  item,
  isOpenId,
  onEdit,
  setIsOpenId,
  setOnEdit,
  refetch,
  types,
}: {
  item: Data;
  isOpenId: string;
  onEdit: string;
  setIsOpenId: (id: string) => void;
  setOnEdit: (id: string) => void;
  refetch: () => void;
  types: DataType;
}) {
  const statusKey = item.status as keyof typeof WARNING_STATUS_COLORS;
  const statusColors = WARNING_STATUS_COLORS[statusKey];

  return (
    <div
      className={`flex ${statusColors.border} border flex-col transition-all duration-300 shadow-sm rounded-2xl m-1 p-0 justify-between w-full bg-gray-100/85`}
      key={item.id}
    >
      <button
        onClick={() => (
          setIsOpenId(isOpenId !== item.id ? item.id : ""),
          setOnEdit("")
        )}
        className={`grid grid-rows-5 md:gap-3 grid-cols-1 md:grid-rows-1 md:grid-cols-5 start-0 left-0 right-0 px-5 py-1.5 md:text-sm text-xs btn transition-all duration-300 w-full m-0 ${statusColors ? `${statusColors.shadow} ${WARNING_STATUS_COLORS.ARCHIVED.bg}` : WARNING_STATUS_COLORS.ARCHIVED} border shadow-lg mb-2`}
      >
        <h3
          className={` ${statusColors.bg} flex items-center justify-center border  ${statusColors.border} rounded-md gap-1 p-0.5 truncate`}
        >
          <strong>Status: </strong> {item.status}
        </h3>
        <h3 className="flex items-center justify-start gap-1 truncate">
          <strong>Assignee: </strong> {item.assignee.name}
        </h3>
        <h3 className="flex items-center justify-start gap-1 truncate">
          <strong>Case: </strong> {item.name}
        </h3>
        <h3 className="flex items-center justify-start gap-1 truncate">
          <strong>Type: </strong>
          {item.type.name}
        </h3>
        <div className="flex justify-end items-end">
          {isOpenId === item.id ? (
            <FaAngleUp className="animate-pulse " size={22} />
          ) : (
            <FaAngleDown className="animate-pulse " size={22} />
          )}
        </div>
      </button>
      <div
        className={`${isOpenId === item.id ? "flex" : "hidden"} lg:flex-row flex-col w-full  items-center justify-center`}
      >
        <div className="flex  lg:flex-row flex-col w-full items-center justify-start p-3">
          <div
            className={`flex grow ${statusColors ? `${statusColors.border} ${statusColors.bg}` : WARNING_STATUS_COLORS.ARCHIVED} border rounded-lg  md:flex-row flex-col items-center justify-center lg:py-10 w-full lg:px-10 p-4 m-2 gap-2`}
          >
            <div className="flex-col w-full flex">
              <h3>
                <strong>Name: </strong>
                {item.name}
              </h3>
              <h3>
                <strong>Type: </strong>
                {item.type.name}
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
                <strong>Status: </strong>
                {item.status}
              </h3>
              <h3>
                <strong>Comment: </strong>
                {item.comment}
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
          </div>
          <div className={`${onEdit === item.id ? "flex" : "hidden"}`}>
            <HrCaseUpdate refetch={refetch} id={item.id} extraData1={types} />
          </div>
        </div>
        <div className="flex p-1 md:m-4  lg:flex-col">
          <DeleteButtonAdmin
            url={`/api/admin/hrWarnings/${item.id}`}
            fetchAction={refetch}
            value={`${item.name} for ${item.assignee.name}`}
          />
          <button
            onClick={() => {
              setOnEdit(onEdit === item.id ? "" : item.id);
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

export default HrCaseCard;
