"use client";

import usePaginatedData from "@/hooks/usePaginatedData";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type UserResponse = {
  id: string;
  name: string | null;
  image: string | null;
};

function SelectUsers({
  selectedId,
  onChange,
}: {
  selectedId: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data, isLoading } = usePaginatedData<UserResponse[]>(
    "/api/admin/users/selectList",
    [],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex w-fit flex-col ">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-fit w-fit shrink-0 cursor-pointer flex  justify-center text-sm items-center gap-2   rounded-sm border border-gray-500  p-1.5 "
      >
        <span className="text-body-sm w-max shrink-0">
          {selectedId || selectedId !== ""
            ? data
                .filter((val) => val.id === selectedId)
                .map((val) => (
                  <div
                    key={val.id}
                    className="flex cursor-pointer gap-3 items-center  rounded hover:bg-gray-700 whitespace-nowrap"
                  >
                    {val.image && (
                      <Image
                        src={val.image}
                        alt={val.name ?? ""}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    )}

                    <span className="whitespace-nowrap">{val.name}</span>
                  </div>
                ))
            : "Select User"}
        </span>
      </button>

      {isLoading ? (
        <Loader
          className="right-3 top-2.5 animate-spin text-gray-200"
          size={20}
        />
      ) : (
        open && (
          <div className="absolute top-10 z-10 flex flex-col min-w-max p-0.5 h-fit bg-gray-800 rounded-md shadow-lg border border-gray-500">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="flex cursor-pointer items-center gap-3 p-2 rounded hover:bg-gray-700 whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Select User</span>
            </button>
            {data.map((user) => (
              <button
                type="button"
                key={user.id}
                onClick={() => {
                  onChange(user.id);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center gap-3 p-2 rounded hover:bg-gray-700 whitespace-nowrap"
              >
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}

                <span className="whitespace-nowrap">{user.name}</span>
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default SelectUsers;
