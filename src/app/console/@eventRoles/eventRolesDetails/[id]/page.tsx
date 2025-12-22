import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

function page({ params }: { params: { id: string } }) {
  const id = params.id;

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
