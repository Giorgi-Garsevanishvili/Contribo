import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

function BackButton() {
  const route = useRouter();
  return (
    <button
      className="flex w-fit items-center border-1 justify-center btn p-2 text-center font-bold rounded-tr-md rounded-bl-md text-m bg-blue-950/70 text-white"
      onClick={() => route.back()}
    >
      <IoMdArrowRoundBack size={25} />
    </button>
  );
}

export default BackButton;
