"use client";

import { IoClose } from "react-icons/io5";
import { useModal } from "../../../context/ModalContext";
import { usePathname } from "next/navigation";


function GeneralModal() {
  const { isOpen, content, closeModal, title, subTitle } = useModal();

  const pathname = usePathname()

  if(pathname === "/" || pathname.startsWith("/singin")) return null

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  z-205 bg-[#00000040] flex items-center justify-center">
      <div
        className="bg-cyan-950 md:w-[73%] overflow-y-scroll no-scrollbar h-fit max-h-[85%] shadow-md shadow-gray-400 border border-gray-700 w-[90%] gap-3 items-center justify-start flex flex-col text-white relative rounded-md p-2"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className="flex border-b border-gray-400/40 w-full items-center p-1 gap-1 justify-between">
          <div className="border-4 h-9 flex w-1 border-cyan-500"></div>
          <div className="flex select-none grow gap-0.5 items-start justify-center p-1 flex-col w-fit shrink-0">
            <h2 className="uppercase font-bold text-lg leading-6">{title}</h2>
            <h5 className="text-xs text-gray-300 italic">{subTitle}</h5>
          </div>
          <button
            className="cursor-pointer mb-2 flex justify-end sticky w-fit"
            onClick={() => closeModal()}
          >
            <IoClose size={22} />
          </button>
        </div>
        {content || <p>Default Modal</p>}
      </div>
    </div>
  );
}

export default GeneralModal;
