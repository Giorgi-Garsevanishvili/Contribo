import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

function page() {
  return (
    <MiniDashCard
      type="user"
      deleteMethod="allowedUser"
      detailPage="AllowedUser"
      title="Allowed Users"
      searchKey={"email"}
      axiosGet="/api/console/allowedUsers"
      axiosPost="/api/console/allowedUsers"
    />
  );
}

export default page;
