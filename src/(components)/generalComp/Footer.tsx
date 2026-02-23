import Link from "next/link";

function Footer() {
  // const date = new Date();
  return (
    <footer className="flex justify-center bg-transparent  overflow-hidden h-auto w-vw p-4 m-0">
      <div className="text-center m-0">
        <h1 className="orbitron px-7 w-full py-0.5 rounded-lg bg-gray-100/85 md:px-0 my-1.5 text-lg font-bold text-[#34495e] inline-block select-none relative">
          <Link target="_blank" className="dev-link" href="https://qirvex.dev/">
            Qirvex{" "}
            <span className="text-xs absolute font-bold text-[#2980b9]">™</span>
          </Link>
        </h1>
        <div className="md:flex flex-col justify-center hidden p-0 m-0">
          <p className="orbitron text-xs text-[#7f8c8d] select-none m-0">
            Precision in Every Build.
          </p>
          <p className="orbitron text-xs text-[#7f8c8d] m-0.5 select-none">
            by
            <Link
              className="text-xs text-[#2980b9] font-medium select-none no-underline hover:text-[#3498db] hover:underline ml-1"
              href="https://github.com/Giorgi-Garsevanishvili"
              target="_blank"
            >
              Giorgi Garsevanishvili
            </Link>
          </p>
          {/* <p className="orbitron text-xs font-medium text-[#7f8c8d] m-1.5 select-none">
          &copy; <span>{date.getFullYear()}</span> All Rights Reserved
        </p> */}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
