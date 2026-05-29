import { ReqStatus } from "@/generated/enums";
import { useCompAlert } from "@/hooks/useCompAlert";
import { useConfirmTab } from "@/hooks/useConfirmTab";
import usePaginatedData from "@/hooks/usePaginatedData";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import RegionJoinCard from "./RegionJoinCard";

type RegionData = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
};
type RequestData = {
  id: string;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
    image: string | null;
  };
  status: ReqStatus;
  requestedAt: string;
  updatedAt: string;
  updatedBy: { name: string | null };
};

function RegionJoinRequestCardVolunteer({
  setRefetchKey,
}: {
  setRefetchKey?: Dispatch<SetStateAction<number>>;
}) {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const session = useSession();
  const { ask } = useConfirmTab();

  const { data: regions, isLoading: regionsLoading } = usePaginatedData<
    RegionData[]
  >("/api/user/regions", []);
  const {
    data: joinRequests,
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = usePaginatedData<RequestData[]>(
    "/api/user/joinRequests?status=PENDING,REQUESTED",
    [],
  );

  const handleJoinRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const confirm = await ask({
        title: `Would You Like To Send Request To Join Section:`,
        message: `This Action will send request to selected region admin. Once approved you will be removed from your section: ${session.data?.user.region}`,
        value: `${regions.filter((r) => r.id === selectedRegion).map((r) => r.name)}`,
      });

      if (!confirm) return;

      const response = await axios.post("/api/user/joinRequests", {
        regionId: selectedRegion,
      });

      triggerCompAlertRef.current({
        message: `${response.data.message}`,
        type: "success",
        isOpened: true,
      });

      setSelectedRegion("");

      refetchRequests();
      if (setRefetchKey) setRefetchKey((prev) => prev + 1);
    } catch (error) {
      const message = getClientErrorMessage(error);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    refetchRequests();
    if (setRefetchKey) setRefetchKey((prev) => prev + 1);
  };

  return (
    <div className="flex relative grow w-full flex-col items-start justify-center md:w-[20%] p-2 border-2  gap-2 border-blue-400  bg-gray-200 rounded-sm">
      <div className="flex absolute bg-blue-400 h-5 w-5 top-0 left-0 rounded-br-sm items-center justify-center text-white">
        <MdOutlineKeyboardArrowDown className="-rotate-45" />
      </div>

      <div className="absolute right-4 flex gap-2 items-center justify-center rounded-full p-0 m-0 top-4 z-10">
        <span className="uppercase text-sm font-semibold">Current:</span>
        <div className="flex items-center justify-center right-4 bg-gray-800 rounded-full p-0 m-0 top-4 z-10">
          <span
            className={`inline-flex items-center rounded-full h-full w-full  px-3 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-200`}
          >
            {session.data?.user.region}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-1 mt-5 justify-center flex-col">
        <h3 className="flex uppercase text-md font-medium text-blue-500">
          Region Join Form
        </h3>
        <h3 className="flex text-sm font-normal text-gray-600">
          Request to join new region. Once approved, you will be removed from
          your current region.
        </h3>
      </div>
      <div className=" flex flex-col md:flex-row w-full items-center justify-start">
        <div className="flex shrink-0 w-auto items-start justify-center p-1">
          <select
            value={selectedRegion}
            onChange={(e) =>
              setSelectedRegion(
                selectedRegion === e.target.value ? "" : e.target.value,
              )
            }
            className="select-def cursor-pointer py-1 px-2"
            name="role"
            id="role"
          >
            <option className="bg-gray-700" value="">
              Select Region
            </option>
            {regions
              ? regions
                  .filter((r) => r.name !== session.data?.user.region)
                  .map((region) => (
                    <option
                      className="bg-gray-700 cursor-pointer"
                      key={region.id}
                      value={region.id}
                    >
                      {region.name}
                    </option>
                  ))
              : "Oops! Something went wrong!"}
          </select>
        </div>
        <div className="flex gap-1 items-center justify-center">
          <button
            type="button"
            onClick={(e) => handleJoinRequest(e)}
            disabled={selectedRegion === ""}
            className="flex w-fit cursor-pointer transition-all text-center duration-300 ease-out p-1 px-2 disabled:opacity-20 rounded-sm items-center justify-center bg-blue-400 gap-2 text-white"
          >
            <BiPlus size={22} /> Request To Join New Region
          </button>
          <button
            onClick={() => setSelectedRegion("")}
            className={`${selectedRegion === "" ? "hidden" : "flex"} w-fit cursor-pointer transition-all text-center duration-300 ease-out p-1 px-2 disabled:opacity-20 rounded-sm items-center justify-center bg-orange-400 text-white`}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start justify-center w-full h-full">
        <h3 className="flex uppercase text-md font-medium text-blue-500">
          Pending Requests
        </h3>
        <div className="flex w-full flex-col h-full items-center justify-center border border-gray-400 p-1 rounded-sm">
          {requestsLoading ? (
            <h3 className="text-sm animate-pulse text-gray-600 p-1">
              Loading...
            </h3>
          ) : joinRequests.length > 0 ? (
            joinRequests.map((joinData) => (
              <RegionJoinCard
                refetch={handleDelete}
                key={joinData.id}
                joinData={joinData}
              />
            ))
          ) : (
            <h3 className="text-sm text-gray-600 p-1">
              You Don`t Have Pending Join Request.
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegionJoinRequestCardVolunteer;
