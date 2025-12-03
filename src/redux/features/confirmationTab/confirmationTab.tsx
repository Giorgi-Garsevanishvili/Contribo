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
      }  z-50`}
    >
      <div className="flex bg-gray-300 p-15 mt-20 rounded-2xl shadow-2xl">
        <div className="flex flex-col">
          <div>
            <h4 className="font-bold p-1">
              {confirmState.title}
              {<span className="text-red-800 ml-1">{confirmState.value}</span>}
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
