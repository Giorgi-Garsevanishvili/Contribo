"use client";

import { IoClose } from "react-icons/io5";
import { useModal } from "../../../context/ModalContext";

function GeneralModal() {
  const { isOpen, content, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 bg-[#00000040] flex items-center justify-center">
      <div
        className="bg-gray-100 relative rounded-md p-2"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button
          className="cursor-pointer mb-2 flex justify-end sticky w-full"
          onClick={() => closeModal()}
        >
          <IoClose size={22} />
        </button>
        {content || <p>Default Modal</p>}
      </div>
    </div>
  );
}

export default GeneralModal;
