import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

function page({ params }: { params: { id: string } }) {
  const id = params.id;

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
