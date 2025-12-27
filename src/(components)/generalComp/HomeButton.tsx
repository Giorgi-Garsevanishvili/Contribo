"use client";
import { useRouter } from "next/navigation";
import { IoHomeOutline } from "react-icons/io5";

function HomeButton() {
  const router = useRouter();

  return (
    <button
      className="flex items-center justify-center btn text-sm text-white bg-[#2c435b90] border-2 border-dotted"
      onClick={() => router.push(`/`)}
    >
      <IoHomeOutline className="text-xl" />
    </button>
  );
}

export default HomeButton;
