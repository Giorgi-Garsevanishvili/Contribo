"client only";

import Image from "next/image";
import SignInForm from "../(auth)/signin/page";
import contriboBgFree from "../../../public/Ind-Logo-Contribo-2-no-fill.svg";

async function MainPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <div className="flex flex-col grow transition-all duration-200 md:flex-row justify-center items-center min-h-full">
      <aside className="flex flex-col justify-center items-center md:w-fit md:p-10  w-71 pl-1 pr-1 pt-6 pb-6 m-3 mt-3 rounded-4xl shadow-inner bg-qirvex-l shadow-gray-500">
        <Image
          priority
          className="w-40 h-auto "
          src={contriboBgFree}
          alt="Contribo logo"
        />
        <p className="flex orbitron select-none text-[#163047]  text-sm w-auto p-0 mt-4 font-normal text-center">
          &quot;Built for those who build a better world.&quot;
        </p>
      </aside>
      <section className="flex ">
        <SignInForm />
      </section>
    </div>
  );
}
export default MainPage;
