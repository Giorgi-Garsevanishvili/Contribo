import React from "react";
import DeleteButton, { DeleteMethod } from "./DeleteButton";
import Link from "next/link";
import {
  AllowedUsersWithRelations,
  GeneralDataWithRelations,
} from "@/types/general-types";

type ListCompParams =
  | {
      type: "user";
      filteredData: AllowedUsersWithRelations[];
      fetchData: () => void;
      title: string;
      detailPage: string;
      deleteMethod: DeleteMethod;
    }
  | {
      type: "general";
      filteredData: GeneralDataWithRelations[];
      fetchData: () => void;
      title: string;
      detailPage: string;
      deleteMethod: DeleteMethod;
    };

function ListComp(props: ListCompParams) {
  const { filteredData, type, fetchData, title, detailPage, deleteMethod } =
    props;
  return (
    <div className="flex items-start justify-center mb-1 p-1 w-full h-full px-3  overflow-auto">
      <ul className="flex flex-col flex-grow gap-2 items-start justify-center">
        {filteredData.length > 0 ? (
          type === "user" ? (
            filteredData.map((item, index) => (
              <li
                className="flex bg-gray-700 rounded-lg w-full p-1 items-center justify-between"
                key={item.id}
              >
                <Link
                  href={`/console/${detailPage}Details/${item.id}`}
                  className="flex items-center justify-start bg-black/40 text-white m-1 pl-2 p-1 rounded-lg w-full"
                >
                  <h5>{index + 1}.</h5>
                  <h5 className="mx-2">{item.email}</h5>
                </Link>
                <DeleteButton
                  id={item.id}
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
                <Link
                  href={`/console/${detailPage}Details/${item.id}`}
                  className="flex items-center justify-start bg-black/40 text-white m-1 pl-2 p-1 rounded-lg w-full"
                >
                  <h5>{index + 1}.</h5>
                  <h5 className="mx-2">{item.name}</h5>
                </Link>
                <DeleteButton
                  id={item.id}
                  method={deleteMethod}
                  onDelete={fetchData}
                />
              </li>
            ))
          ) : (
            <p className="text-gray-300 text-sm mt-2">No {title} found.</p>
          )
        ) : (
          <p className="text-gray-300 text-sm mt-2">No {title} found.</p>
        )}
      </ul>
    </div>
  );
}

export default ListComp;
