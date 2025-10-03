import Link from "next/link";

const Nav = () => {
  return (
    <header className="flex justify-around w-full p-1">
      <button className="btn bg-amber-700 text-white">
        <Link href={"/"}>Home</Link>
      </button>
      <div className="flex justify-end w-full items-center">
        <button className="btn">
          <Link href={"/admin"}>Admin</Link>
        </button>
        <button className="btn">
          <Link href={"/main"}>Main</Link>
        </button>
      </div>
    </header>
  );
};
export default Nav;
