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

function SelectUsers() {
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
    <div ref={ref} className="relative flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-12.25 w-fit cursor-pointer flex stroke-grayscale-500 justify-center text-body-sm items-center gap-2 bg-grayscale-50 border border-grayscale-100 rounded-[10px] px-5 py-1.75"
      >
        <span className="text-body-sm text-grayscale-500 shrink-0">
          User
        </span>
        <span className="text-body-sm text-[#4F46E5] shrink-0"></span>
        
      </button>

      {isLoading ? (
        <Loader
          className="right-3 top-2.5 animate-spin text-gray-200"
          size={20}
        />
      ) : (
        open && (
          <div className="absolute top-15 flex overflow-hidden flex-col w-fit p-1 h-fit bg-gray-800 rounded-[10px] shadow-lg border border-grayscale-100">
            {data.map((user) => (
              <button
                type="button"
                key={user.id}
                onClick={() => {
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center gap-3 p-2 rounded hover:bg-gray-700"
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

                <span>{user.name}</span>
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default SelectUsers;
