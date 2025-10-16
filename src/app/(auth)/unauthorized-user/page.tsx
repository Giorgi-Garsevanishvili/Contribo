import SignOut from "@/(components)/sign-out";
import { auth } from "@/lib/auth";
import Link from "next/link";

const Unauthorized = async () => {
  const session = await auth();

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="text-red-500 text-2xl p-6 m-3 text-center w-auto bg-white shadow-lg rounded-3xl ">
        Oops! It seems you don’t have access to this platform. <br/>If you believe
        this is a mistake, please get in touch with your Admin or Qirvex
        support.
      </div>
      <div>{session ? <SignOut /> : null}</div>
      <Link className="btn-log" href={"/"}>
        Back To Main
      </Link>
    </main>
  );
};
export default Unauthorized;
