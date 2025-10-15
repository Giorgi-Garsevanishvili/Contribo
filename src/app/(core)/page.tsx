"client only";

import Image from "next/image";
import SignInForm from "../(auth)/signin/page";
import contriboBgFree from "../../../public/Ind Logo Contribo 2.png";

async function MainPage() {
  return (
    <main className="flex flex-col md:flex-row justify-center items-center">
      <aside className="flex flex-col justify-center items-center m-5">
        <Image
          className="w-40 h-auto"
          src={contriboBgFree}
          alt="Contribo logo"
        />
        <p className="hidden md:flex text-base w-80 p-1 mt-4 font-medium text-center">
          Welcome Back Powering the future of volunteer engagement with smart
          dashboards, real-time tracking, and AI-driven insights, all in one
          scalable platform.
        </p>
      </aside>
      <section className="flex ">
        <SignInForm />
      </section>
    </main>
  );
}
export default MainPage;
