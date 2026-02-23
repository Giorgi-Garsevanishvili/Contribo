import { auth } from "@/lib/auth";

async function Admin() {
  const user = await auth();
  return (
    <div className="flex w-full text-gray-100 bg-gray-600 m-4 mt-0 rounded-md p-2 justify-start ">
      <h3 className=" w-full uppercase">
        Welcome {user?.user.name}
      </h3>
    </div>
  );
}
export default Admin;
