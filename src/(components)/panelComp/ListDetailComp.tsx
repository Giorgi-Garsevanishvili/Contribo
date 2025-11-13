import React from "react";
import {
  AllowedUsersWithRelations,
  GeneralDataWithRelations,
} from "@/types/general-types";
import { Region } from "@prisma/client";

type ListDetailCompProps =
  | {
      type: "user";
      data: AllowedUsersWithRelations;
    }
  | {
      type: "general";
      data: GeneralDataWithRelations;
    }
  | {
      type: "region";
      data: Region[];
    };

function ListDetailComp({ type, data }: ListDetailCompProps) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-start">
      <ul className="flex flex-col justify-center overflow-auto w-[95%]">
        <li className="flex bg-gray-700 rounded-lg w-full p-3 items-center justify-between">
          <ul className="flex flex-col items-start justify-center">
            {type === "user" ? (
              <>
                <li>
                  Email: <span className="text-blue-300">{data?.email}</span>
                </li>
                <li>
                  Region:{" "}
                  <span className="text-blue-300">
                    {data?.region?.name || "Not Set"}
                  </span>
                </li>
                <li>
                  Role:{" "}
                  <span className="text-blue-300">
                    {data?.role?.name || "Not Set"}
                  </span>
                </li>
                <li>
                  Created By:{" "}
                  <span className="text-blue-300">
                    {data?.createdBy?.name || "Unknown User"}
                  </span>
                </li>
                <li>
                  Created At:{" "}
                  <span className="text-blue-300">
                    {data?.createdAt.toDateString()}
                  </span>
                </li>
                <li>
                  Updated At:{" "}
                  <span className="text-blue-300">
                    {data?.updatedAt?.toDateString() || "Not Updated"}
                  </span>
                </li>
                <li>
                  Type:
                  <span className="text-blue-300"> {data?.type}</span>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default ListDetailComp;
