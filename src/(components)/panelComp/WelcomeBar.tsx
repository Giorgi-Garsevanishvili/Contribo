import CurrentPathWelcomeBar from "@/lib/CurrentPathWelcomeBar";

async function WelcomeBar() {
  return (
    <div className="flex w-full text-gray-100 bg-gray-600  m-0 mb-4 border-b p-4 justify-start ">
      <h3 className=" w-full"><CurrentPathWelcomeBar /></h3>
    </div>
  );
}

export default WelcomeBar;
