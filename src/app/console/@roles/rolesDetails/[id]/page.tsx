import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

function page({ params }: { params: { id: string } }) {
  const id = params.id;

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
