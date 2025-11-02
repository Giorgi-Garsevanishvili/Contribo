function Footer() {
  // const date = new Date();
  return (
    <footer className="flex justify-center bg-transparent  overflow-hidden h-auto w-vw p-4 m-0">
      <div className="text-center m-0">
        <h1 className="orbitron text-lg font-bold text-[#34495e] m-0 inline-block select-none relative">
          <a target="_blank" className="dev-link" href="https://qirvex.dev/">
            Qirvex{" "}
            <span className="text-xs absolute font-bold text-[#2980b9]">™</span>
          </a>
        </h1>
        <p className="orbitron text-xs text-[#7f8c8d] select-none m-0">
          Precision in Every Build.
        </p>
        <p className="orbitron text-xs text-[#7f8c8d] m-0.5 select-none">
          by
          <a
            className="text-xs text-[#2980b9] font-medium select-none no-underline hover:text-[#3498db] hover:underline ml-1"
            href="https://github.com/Giorgi-Garsevanishvili"
            target="_blank"
          >
            Giorgi Garsevanishvili
          </a>
        </p>
        {/* <p className="orbitron text-xs font-medium text-[#7f8c8d] m-1.5 select-none">
          &copy; <span>{date.getFullYear()}</span> All Rights Reserved
        </p> */}
      </div>
    </footer>
  );
}
export default Footer;
