"use client";
import { useFetchData } from "@/hooks/useDataFetch";
import { useParams, useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";

type Data = {
  id: string;
  status: string;
  name: string;
  type: { name: string };
  assignee: { name: string };
}[];

type Props = {
  APIPath: string;
  title: string;
  Icon: IconType;
  URLPath: string;
  refetchKey?: number;
};

function UserInfoButtons({ APIPath, title, Icon, URLPath, refetchKey }: Props) {
  const params = useParams();

  const router = useRouter();

  const { data, isLoadingFetch } = useFetchData<Data>(
    `/api/admin/users/${params.userId}/${APIPath}`,
    [refetchKey],
  );

  return (
    <>
      {data ? (
        <>
          <button
            onClick={() => router.push(`/admin/users/${params.userId}/${URLPath}`)}
            className="btn grow w-full md:w-auto bg-gray-300/85 hover:ring-2 ring-white "
          >
            <Icon size={23} className="m-2" /> {title}: {data.length}
          </button>
        </>
      ) : (
        <div
          className={`flex ${isLoadingFetch ? "animate-pulse transition-all duration-300" : ""} flex-col rounded-md bg-gray-300/65 justify-center items-center w-45 p-3 m-1 h-10}`}
        >
          <h3 className="mb-2">{title}</h3>
          <h3>Loading...</h3>
        </div>
      )}
    </>
  );
}
export default UserInfoButtons;
