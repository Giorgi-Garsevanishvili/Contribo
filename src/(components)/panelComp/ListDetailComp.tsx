import React from "react";
import {
  AllowedUsersWithRelations,
  GeneralDataWithRelations,
} from "@/types/general-types";
import { Region } from "@prisma/client";
import Image from "next/image";

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
      data: Region;
    };

function ListDetailComp({ type, data }: ListDetailCompProps) {
  return (
    <div className="flex flex-col w-full h-fit items-center justify-start">
      <ul className="flex flex-col justify-start overflow-hidden w-[95%]">
        <li className="flex bg-gray-700 rounded-lg w-full p-3 items-center justify-between">
          <ul className="flex flex-col items-start justify-center w-full">
            {type === "user" && (
              <>
                <li>
                  Email: <span className="text-blue-300">{data.email}</span>
                </li>
                <li>
                  Region:{" "}
                  <span className="text-blue-300">
                    {data.region?.name || "Not Set"}
                  </span>
                </li>

                <li>
                  Role:{" "}
                  {data.roles.length > 0 ? (
                    <span className="ml-2 text-blue-300">
                      {data.roles
                        .map((r) => r.role.name || "Not Set")
                        .join(", ")}
                    </span>
                  ) : (
                    <span className="text-blue-300">Not Set</span>
                  )}
                </li>

                <li>
                  Created By:{" "}
                  <span className="text-blue-300">
                    {data.createdBy?.name || "Unknown"}
                  </span>
                </li>
                <li>
                  Created At:{" "}
                  <span className="text-blue-300">
                    {data.createdAt.toISOString()}
                  </span>
                </li>
                <li>
                  Updated At:{" "}
                  <span className="text-blue-300">
                    {data.updatedAt?.toDateString() || "Not Updated"}
                  </span>
                </li>
                <li>
                  Type: <span className="text-blue-300">{data.type}</span>
                </li>
              </>
            )}

            {type === "general" && (
              <>
                <li>
                  Name: <span className="text-blue-300">{data.name}</span>
                </li>
                <li>
                  Created At:{" "}
                  <span className="text-blue-300">
                    {data.createdAt.toLocaleString()}
                  </span>
                </li>
                <li>
                  Updated At:{" "}
                  <span className="text-blue-300">
                    {data.updatedAt?.toLocaleString() || "Not Updated"}
                  </span>
                </li>
              </>
            )}

            {type === "region" && (
              <>
                <div className="flex bg-accent text-black rounded-2xl mb-2 p-1 w-full items-center justify-center">
                  {data.logo && data.logo.length > 5 ? (
                    <Image
                      priority
                      src={data.logo?.trim()}
                      alt="Section Logo"
                      className="rounded-2xl w-auto h-20"
                    />
                  ) : (
                    "Logo Will Appear Here!"
                  )}
                </div>

                <li>
                  Name: <span className="text-blue-300">{data.name}</span>
                </li>
                <li>
                  Email:{" "}
                  <span className="text-blue-300">{data.email || "—"}</span>
                </li>
                <li>
                  Phone:{" "}
                  <span className="text-blue-300">{data.phone || "—"}</span>
                </li>
                <li>
                  Address:{" "}
                  <span className="text-blue-300">{data.address || "—"}</span>
                </li>
                <li>
                  Description:{" "}
                  <span className="text-blue-300 text-wrap">
                    {data.description || "—"}
                  </span>
                </li>
                <li>
                  Website:{" "}
                  <span className="text-blue-300">{data.website || "—"}</span>
                </li>
                <li>
                  Status: <span className="text-blue-300">{data.status}</span>
                </li>
                <li>
                  Created At:{" "}
                  <span className="text-blue-300">
                    {data.createdAt.toLocaleString()}
                  </span>
                </li>
                <li>
                  Updated At:{" "}
                  <span className="text-blue-300">
                    {data.updatedAt?.toLocaleString() || "Not Updated"}
                  </span>
                </li>
              </>
            )}
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default ListDetailComp;
