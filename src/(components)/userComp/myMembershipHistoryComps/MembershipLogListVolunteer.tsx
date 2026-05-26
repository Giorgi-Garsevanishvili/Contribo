import { useMemo, useState } from "react";
import usePaginatedData from "@/hooks/usePaginatedData";
import { useParams } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";
import MembershipCardVolunteer from "./MembershipCardVolunteer";

type Data = {
  user: { name: true };
  status: { name: true };
  id: string;
  ended: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy: { name: true } | null;
  updatedBy: { name: true } | null;
  startedAt: string;
  endedAt: string;
};

function MembershipListVolunteer({ fetchUrl }: { fetchUrl: string }) {
  const { data, isLoading: isLoadingFetch } = usePaginatedData<Data[]>(
    fetchUrl,
    [],
  );

  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      return Number(a.ended) - Number(b.ended);
    });
  }, [data]);

  return (
    <div
      className={`flex w-full items-center justify-center xl:px-25 xl:py-5 px-2 flex-col`}
    >
      {isLoadingFetch ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <ImSpinner9 className="animate-spin" size={25} />
        </div>
      ) : sortedData && sortedData?.length > 0 ? (
        sortedData?.map((item) => (
          <MembershipCardVolunteer key={item.id} item={item} />
        ))
      ) : (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold">No Membership Logs to display.</h3>
        </div>
      )}
    </div>
  );
}

export default MembershipListVolunteer;
