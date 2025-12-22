import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

function page({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <MiniDashDetails
      id={id}
      type="general"
      title="Member Status"
      axiosGet="/api/console/memberStatus"
      axiosPut="/api/console/memberStatus"
      deleteMethod="memberStatus"
    />
  );
}

export default page
