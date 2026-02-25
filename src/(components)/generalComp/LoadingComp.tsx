"use client";

import { ImSpinner9 } from "react-icons/im";
import UseAnimations from "react-useanimations";
import loading2 from "react-useanimations/lib/loading2";

function LoadingComp() {
  return (
    <div className="flex flex-col w-full h-full text-[#02032d] bg-white/40 rounded-md p-5 overflow-auto transition-all m-0 duration-300 justify-center items-center ">
      <ImSpinner9 className="animate-spin" size={25} />
      <h1 className="font-bold text-xl mt-2  orbitron">Connecting to Qirvex™</h1>
    </div>
  );
}
export default LoadingComp;
