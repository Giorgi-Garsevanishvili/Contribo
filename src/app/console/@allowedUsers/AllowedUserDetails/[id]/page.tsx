import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <MiniDashDetails
      id={id}
      type="user"
      axiosGet="/api/console/allowedUsers"
      axiosPut="/api/console/allowedUsers"
      title="Allowed User"
      deleteMethod="allowedUser"
    />
  );
}

export default page;
