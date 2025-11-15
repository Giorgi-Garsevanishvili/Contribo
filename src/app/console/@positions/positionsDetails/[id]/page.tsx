import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

function page({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <MiniDashDetails
      id={id}
      type="general"
      title="Positions"
      axiosGet="/api/console/positions"
      axiosPut="/api/console/positions"
      deleteMethod="position"
    />
  );
}

export default page;
