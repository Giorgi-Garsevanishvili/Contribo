import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <MiniDashDetails
      id={id}
      type="region"
      title="Regions"
      axiosGet="/api/console/regions"
      axiosPut="/api/console/regions"
      deleteMethod="region"
    />
  );
}

export default page;
