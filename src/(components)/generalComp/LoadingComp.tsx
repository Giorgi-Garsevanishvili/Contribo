"use client";

import UseAnimations from "react-useanimations";
import loading2 from "react-useanimations/lib/loading2";

function LoadingComp() {
  return (
    <div className="flex flex-col w-full h-full bg-white/40 rounded-md p-5 overflow-auto transition-all m-0 duration-300 justify-center items-center ">
      <UseAnimations animation={loading2} size={110} fillColor="#000000" wrapperStyle={{borderRadius: "50%"}}/>
      <h1 className="font-bold text-xl mt-2 text-[#000000] orbitron">Connecting to Qirvex™</h1>
    </div>
  );
}
export default LoadingComp;
