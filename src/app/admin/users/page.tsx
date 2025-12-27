"use client";
import { useRouter } from "next/navigation";

function Admin() {
  const route = useRouter();
  return (
    <>
      <div className="text-white">Admin</div>
      <button className="btn" onClick={() => route.back()}>Back</button>
    </>
  );
}
export default Admin;
