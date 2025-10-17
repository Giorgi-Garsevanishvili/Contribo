"use client";

import UseAnimations from "react-useanimations";
import loading2 from "react-useanimations/lib/loading2";

function loading() {
  return (
    <div className="flex flex-col w-screen min-h-110 overflow-auto transition-all p-0 m-0 duration-300 justify-center items-center ">
      <UseAnimations animation={loading2} size={120} fillColor="#2b5a83" wrapperStyle={{borderRadius: "50%"}}/>
      <h1 className="font-bold text-xl mt-2 text-[#2b5a83] orbitron">Connecting to Qirvex™</h1>
    </div>
  );
}
export default loading;
