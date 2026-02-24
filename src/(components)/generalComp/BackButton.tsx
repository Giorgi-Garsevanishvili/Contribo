import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

function BackButton() {
  const route = useRouter();
  return (
    <button
      className="flex w-fit items-center border justify-center btn m-0 p-1 text-center font-bold rounded-md text-m bg-blue-950/70 text-white"
      onClick={() => route.back()}
    >
      <IoMdArrowRoundBack size={25} />
    </button>
  );
}

export default BackButton;
