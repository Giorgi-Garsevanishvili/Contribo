"use client";
import { ROLE_ROUTE_MAP } from "@/lib/roleRoutes";
import { useRouter } from "next/navigation";

function SwitchPageButton({ name }: { name: string }) {
  const router = useRouter();
  const route = ROLE_ROUTE_MAP[name] ?? "volunteer";

  return (
    <button 
      className="cursor-pointer shadow-inner shadow-gray-800 transition-all m-1 rounded-md hover:text-primary hover:bg-white text-sm text-white bg-gray-500 p-1.5 border"
      onClick={() => router.push(`/${route}`)}
    >
      {name}
    </button>
  );
}

export default SwitchPageButton;
