import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <MiniDashDetails
      id={id}
      type="general"
      title="Event Roles"
      axiosGet="/api/console/eventRoles"
      axiosPut="/api/console/eventRoles"
      deleteMethod="eventRoles"
    />
  );
}

export default page;
