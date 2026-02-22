function BrandMark() {
  return (
    <a target="_blank" className="dev-link" href="https://qirvex.dev/">
      <div className="flex justify-center bg-slate-100 rounded-md m-4  items-center overflow-hidden h-auto w-vw p-2">
        <div className="text-center flex items-center justify-center m-0">
          <p className="text-xs mr-1 text-slate-800">Powered By</p>
          <h1 className="orbitron p-2 rounded-lg bg-gray-100/85 md:px-0 md:rounded-none md:p-0 md:bg-transparent text-sm font-bold text-[#34495e] m-0 inline-block select-none relative">
            Qirvex{" "}
            <span className="text-xs absolute font-bold text-[#2980b9]">™</span>
          </h1>
        </div>
      </div>
    </a>
  );
}
export default BrandMark;
