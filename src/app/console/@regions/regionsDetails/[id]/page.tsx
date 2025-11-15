import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

function page({ params }: { params: { id: string } }) {
  const id = params.id;

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
