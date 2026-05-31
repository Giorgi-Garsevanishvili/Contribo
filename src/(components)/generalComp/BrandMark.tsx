import Link from "next/link";

function BrandMark() {
  const versionInfo = process.env.VERSION_TEXT;
  return (
    <Link target="_blank" className="dev-link" href="https://qirvex.dev/">
      <div className="flex grow m-4 items-center justify-center flex-col">
        <div
          className={`flex p-1 shadow shadow-gray-200/60 px-5 rounded-t-md font-light  bg-gray-800 text-[10px] text-white w-fit items-center justify-center`}
        >
          <h3>BETA 1.0</h3>
        </div>
        <div className="flex justify-center bg-slate-100 rounded-md   items-center overflow-hidden h-auto w-full p-2">
          <div className="text-center flex items-center justify-center m-0">
            <p className="text-xs mr-1 text-slate-800">Powered By</p>
            <h1 className="orbitron p-2 rounded-lg bg-gray-100/85 md:px-0 md:rounded-none md:p-0 md:bg-transparent text-sm font-bold text-[#34495e] m-0 inline-block select-none relative">
              Qirvex{" "}
              <span className="text-xs absolute font-bold text-[#2980b9]">
                ™
              </span>
            </h1>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default BrandMark;
