import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

function page({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <MiniDashDetails
      id={id}
      type="general"
      title="HR Warning Type Details"
      axiosGet="/api/console/hr-warning-type"
      axiosPut="/api/console/hr-warning-type"
      deleteMethod="hrWarningsType"
    />
  );
}

export default page;
