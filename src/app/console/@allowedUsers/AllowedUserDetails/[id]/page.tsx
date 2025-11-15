import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

function page({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <MiniDashDetails
      id={id}
      type="user"
      axiosGet="/api/console/allowed-users"
      axiosPut="/api/console/allowed-users"
      title="Allowed User"
      deleteMethod="allowedUser"
    />
  );
}

export default page;
