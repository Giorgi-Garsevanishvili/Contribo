import SignOut from "@/(components)/authComp/sign-out";
import { auth } from "@/lib/auth";
import Link from "next/link";

const Unauthorized = async () => {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-red-500 text-2xl p-6 m-3 bg-white shadow-lg rounded-3xl ">
        Unauthorized Access!
      </div>
      <div>{session ? <SignOut /> : null}</div>
      <Link className="btn-log" href={"/"}>
        Back To Main
      </Link>
    </div>
  );
};
export default Unauthorized;
