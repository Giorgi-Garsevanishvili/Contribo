import { useMemo, useState } from "react";
import usePaginatedData from "@/hooks/usePaginatedData";
import { useParams } from "next/navigation";
import DeleteButtonAdmin from "../DeleteButtonAdmin";
import { ImSpinner9 } from "react-icons/im";
import MembershipCard from "./MembershipCard";

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

function MembershipList({ fetchUrl }: { fetchUrl: string }) {
  const [onEdit, setOnEdit] = useState("");
  const params = useParams();
  const id = params.userId;

  const {
    data,
    isLoading: isLoadingFetch,
    refetch,
  } = usePaginatedData<Data[]>(fetchUrl, []);

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
      <div className="flex flex-col items-center md:flex-row m-2 justify-center">
        {data.length > 0 ? (
          <div className="flex shadow-md shadow-white bg-gray-200/95 p-2 m-2 rounded-lg">
            <DeleteButtonAdmin
              styleClass="bg-red-900 text-white"
              extraTXT="Delete All"
              url={`/api/admin/users/${id}/memberStatusLog`}
              fetchAction={refetch}
              value={`All Membership Log Records for ${data[0].user?.name}?`}
            />
          </div>
        ) : null}
      </div>

      {isLoadingFetch ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <ImSpinner9 className="animate-spin" size={25} />
        </div>
      ) : sortedData && sortedData?.length > 0 ? (
        sortedData?.map((item) => (
          <MembershipCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            setOnEdit={setOnEdit}
            refetch={refetch}
          />
        ))
      ) : (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold">No Membership Logs to display.</h3>
        </div>
      )}
    </div>
  );
}

export default MembershipList;
