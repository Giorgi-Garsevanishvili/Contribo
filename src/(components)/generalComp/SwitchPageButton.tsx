"use client";
import { ROLE_ROUTE_MAP } from "@/lib/roleRoutes";
import { useRouter } from "next/navigation";
import React from "react";

function SwitchPageButton({ name }: { name: string }) {
  const router = useRouter();
  const route = ROLE_ROUTE_MAP[name] ?? "volunteer";

  return (
    <button
      className="btn text-sm text-white bg-[#2c435b90] p-1.5 border"
      onClick={() => router.push(`/${route}`)}
    >
      {name}
    </button>
  );
}

export default SwitchPageButton;
