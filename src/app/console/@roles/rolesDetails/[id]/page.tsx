import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <MiniDashDetails
      id={id}
      type="general"
      title="Roles"
      axiosGet="/api/console/roles"
      axiosPut="/api/console/roles"
      deleteMethod="role"
    />
  );
}

export default page;
