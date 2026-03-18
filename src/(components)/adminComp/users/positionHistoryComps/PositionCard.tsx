import DeleteButtonAdmin from "../DeleteButtonAdmin";
import { TbPencil, TbPencilCancel } from "react-icons/tb";
import PositionUpdate from "./PositionHistoryUpdate";
import { VscDebugBreakpointLogUnverified } from "react-icons/vsc";
import { FaLandmarkDome } from "react-icons/fa6";
import DetailsInfo from "../../accesses/DetailsInfo";

type Data = {
  user: { name: true };
  position: { name: true };
  id: string;
  ended: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy: { name: true } | null;
  updatedBy: { name: true } | null;
  startedAt: string;
  endedAt: string;
};

type DetailData = {
  id: string;
  createdBy: {
    name: string | null;
  } | null;
  createdAt: string;
  updatedBy: {
    name: string | null;
  } | null;
  updatedAt: string | null;
};

function PositionCard({
  item,
  onEdit,
  setOnEdit,
  refetch,
}: {
  item: Data;
  onEdit: string;
  setOnEdit: (id: string) => void;
  refetch: () => void;
}) {
  const DetailInfoData = {
    id: item.id,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
    updatedBy: item.updatedBy,
    createdBy: item.createdBy,
  } as DetailData;

  return (
    <div
      className={`flex  border flex-col transition-all duration-300 shadow-sm rounded-2xl m-1 p-0 justify-between w-full bg-gray-100/85`}
      key={item.id}
    >
      <div
        className={`flex relative lg:flex-row flex-col w-full  items-center justify-center`}
      >
        <div className="flex m-3 flex-col w-full items-center md:mb-5 justify-start">
          <div
            className={`text-gray-800 text-sm italic gap-2 flex absolute top-0 left-2 items-center justify-center rounded-md m-0 p-1.5`}
          >
            <FaLandmarkDome size={18} />
            <h3>Position History Log Card</h3>
          </div>
          <div
            className={`flex flex-col grow border-gray-400/30  bg-gray-200/70  border rounded-lg  md:flex-row  items-center justify-center m-6  w-full p-2 `}
          >
            <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-1 gap-4 items-center justify-center">
              <div className="grid">
                <h2>
                  <strong>Position: </strong> {item.position.name}
                </h2>
                <h5 className="text-xs truncate text-gray-600 italic">
                  {item.user.name}
                </h5>
              </div>
              <div
                className={`text-white ${item.ended ? "bg-red-800" : "bg-green-700"} rounded-full m-0 p-0`}
              >
                <VscDebugBreakpointLogUnverified size={23} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm italic ">
                  <strong>Since: </strong>{" "}
                  {item.startedAt
                    ? new Date(item.startedAt).toDateString()
                    : "No Data"}
                </h2>
                <h2 className="text-sm italic ">
                  <strong>Till: </strong>{" "}
                  {item.endedAt
                    ? new Date(item.endedAt).toDateString()
                    : "No Data"}
                </h2>
              </div>
            </div>
            <div className="flex md:absolute gap-2 mt-2 md:mt-0 w-full md:w-auto md:content-center md:right-5 items-center justify-center p-1">
              <button
                onClick={() => {
                  setOnEdit(onEdit === item.id ? "" : item.id);
                }}
                className={`btn items-center justify-center ${item.ended ? "hidden" : "flex"}  ${onEdit === item.id ? "bg-gray-600 border-red-600/40 text-red-900" : "hover:text-blue-950 hover:border-blue-800"} bg-transparent m-0 p-1 border border-gray-500/30 h-fit w-fit grow`}
              >
                {onEdit === item.id ? (
                  <>
                    <TbPencilCancel size={22} />
                  </>
                ) : (
                  <>
                    <TbPencil size={22} />
                  </>
                )}
              </button>
              <DeleteButtonAdmin
                styleClass="bg-transparent grow hover:text-red-900 hover:border-red-600/40 w-fit h-fit p-1 m-0  border-gray-500/30 border"
                url={`/api/admin/positionHistory/${item.id}`}
                fetchAction={refetch}
                value={`Position: ${item.position.name} for ${item.user?.name}`}
              />
            </div>
          </div>
          <div className={`${onEdit === item.id ? "flex" : "hidden"}`}>
            <PositionUpdate ended={item.ended} refetch={refetch} id={item.id} />
          </div>
        </div>
        <DetailsInfo details={DetailInfoData} />
      </div>
    </div>
  );
}

export default PositionCard;
