"use client";
import React from "react";
import DeleteButton, { DeleteMethod } from "./DeleteButton";
import { useRouter } from "next/navigation";
import { FilteredDataType } from "./MiniDashCard";

type ListCompParams =
  | {
      type: "user";
      filteredData: FilteredDataType[];
      fetchData: () => void;
      title: string;
      detailPage: string;
      deleteMethod: DeleteMethod;
    }
  | {
      type: "general";
      filteredData: FilteredDataType[];
      fetchData: () => void;
      title: string;
      detailPage: string;
      deleteMethod: DeleteMethod;
    }
  | {
      type: "roles";
      filteredData: FilteredDataType[];
      fetchData: () => void;
      title: string;
      detailPage: string;
      deleteMethod: DeleteMethod;
    }
  | {
      type: "regions";
      filteredData: FilteredDataType[];
      fetchData: () => void;
      title: string;
      detailPage: string;
      deleteMethod: DeleteMethod;
    };

function ListComp(props: ListCompParams) {
  const { filteredData, type, fetchData, title, detailPage, deleteMethod } =
    props;

  const router = useRouter();
  return (
    <div className="flex items-start justify-center mb-1 w-full h-full overflow-hidden">
      <ul className="flex flex-col flex-grow gap-2 items-start justify-center">
        {filteredData.length > 0 ? (
          type === "user" ? (
            filteredData.map((item, index) => (
              <li
                className="flex bg-gray-700 rounded-lg w-full p-1 items-center justify-between"
                key={item.id}
              >
                <button
                  onClick={() =>
                    router.push(`/console/${detailPage}Details/${item.id}`)
                  }
                  className="flex btn items-center justify-start bg-black/40 text-white m-1 pl-2 p-1 rounded-lg w-full"
                >
                  <h5>{index + 1}.</h5>
                  <h5 className="mx-2 w-[12rem] overflow-hidden">{item.email}</h5>
                </button>
                <DeleteButton
                  id={item.id}
                  value={item.email}
                  method={deleteMethod}
                  onDelete={fetchData}
                />
              </li>
            ))
          ) : type === "general" ? (
            filteredData.map((item, index) => (
              <li
                className="flex bg-gray-700 rounded-lg w-full p-1 items-center justify-between"
                key={item.id}
              >
                <button
                  onClick={() =>
                    router.push(`/console/${detailPage}Details/${item.id}`)
                  }
                  className="flex btn items-center justify-start bg-black/40 text-white m-1 pl-2 p-1 rounded-lg w-full"
                >
                  <h5>{index + 1}.</h5>
                  <h5 className="mx-2">{item.name}</h5>
                </button>
                <DeleteButton
                  id={item.id}
                  value={item.name}
                  method={deleteMethod}
                  onDelete={fetchData}
                />
              </li>
            ))
          ) : type === "regions" ? (
            filteredData.map((item, index) => (
              <li
                className="flex bg-gray-700 rounded-lg w-full p-1 items-center justify-between"
                key={item.id}
              >
                <button
                  onClick={() =>
                    router.push(`/console/${detailPage}Details/${item.id}`)
                  }
                  className="flex btn items-center justify-start bg-black/40 text-white m-1 pl-2 p-1 rounded-lg w-full"
                >
                  <h5>{index + 1}.</h5>
                  <h5 className="mx-2">{item.name}</h5>
                </button>
                <DeleteButton
                  id={item.id}
                  method={deleteMethod}
                  value={item.name}
                  onDelete={fetchData}
                />
              </li>
            ))
          ) : type === "roles" ? (
            filteredData.map((item, index) => (
              <li
                className="flex bg-gray-700 rounded-lg w-full p-1 items-center justify-between"
                key={item.id}
              >
                <button
                  onClick={() =>
                    router.push(`/console/${detailPage}Details/${item.id}`)
                  }
                  className="flex btn items-center justify-start bg-black/40 text-white m-1 pl-2 p-1 rounded-lg w-full"
                >
                  <h5>{index + 1}.</h5>
                  <h5 className="mx-2">{item.name}</h5>
                </button>
                <DeleteButton
                  id={item.id}
                  value={item.name}
                  method={deleteMethod}
                  onDelete={fetchData}
                />
              </li>
            ))
          ) : null
        ) : (
          <p className="text-gray-300 text-sm mt-2">No {title} found.</p>
        )}
      </ul>
    </div>
  );
}

export default ListComp;
