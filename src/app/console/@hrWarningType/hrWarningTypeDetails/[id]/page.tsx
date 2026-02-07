import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  return (
    <MiniDashDetails
      id={id}
      type="general"
      title="HR Warning Type Details"
      axiosGet="/api/console/hrWarningTypes"
      axiosPut="/api/console/hrWarningTypes"
      deleteMethod="hrWarningsType"
    />
  );
}

export default page;
