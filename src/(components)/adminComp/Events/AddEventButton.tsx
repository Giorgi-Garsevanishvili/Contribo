"use client";
import { IoAdd } from "react-icons/io5";
import { useModal } from "../../../../context/ModalContext";
import EventCreateModal from "./EventCreateModal";

function AddEventButton({parentRefetch}: {parentRefetch: () => void}) {
  const { openModal } = useModal();
  return (
    <button
      onClick={() => openModal("Initialize Event", "General Event Initializer", <EventCreateModal parentRefetch={parentRefetch}/>)}
      className="fixed bottom-34 z-150 right-4 md:right-6 md:bottom-20 ring ring-gray-900/30 bg-cyan-700 text-white rounded-4xl p-2 text-3xl shadow-gray-300 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer hover:opacity-75 duration-200"
    >
      <IoAdd />
    </button>
  );
}

export default AddEventButton;
