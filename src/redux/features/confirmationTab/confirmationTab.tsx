"use client";
import { useConfirmTab } from "@/hooks/useConfirmTab";

export type ConfirmProp = {
  title: string;
  message: string;
  value?: string;
  opt1?: string;
  opt2?: string;
  isOpened: boolean;
  confirmed?: boolean;
};

function ConfirmTab() {
  const { confirmState, onConfirm, onReject } = useConfirmTab();

  return (
    <div
      className={`fixed inset-0 flex justify-center items-start transition ${
        confirmState.isOpened
          ? "w-screen h-screen bg-gray-900/85"
          : "pointer-events-none opacity-0"
      }  z-210`}
    >
      <div className="flex w-full justify-center items-center flex-wrap bg-gray-300 p-5 md:p-15 mt-20 rounded-2xl shadow-2xl">
        <div className="flex w-full flex-col">
          <div className="p-2 flex flex-col w-full">
            <h4 className="flex w-full grow gap-0.5 flex-col md:flex-row font-bold p-1">
              {confirmState.title}
              {<span className="flex md:flex-row text-red-800 truncate">{confirmState.value}?</span>}
              
            </h4>
            <p className="font-light italic p-1">{confirmState.message}</p>
          </div>
          <div className="flex items-center text-white justify-center">
            <button
              onClick={onConfirm}
              className="btn bg-[#E74C3C] w-full justify-center"
            >
              {confirmState.opt1}
            </button>
            <button
              onClick={onReject}
              className="btn bg-[#48765b] w-full justify-center"
            >
              {confirmState.opt2}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmTab;
