import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

function page({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <MiniDashDetails
      id={id}
      type="general"
      title="Member Status"
      axiosGet="/api/console/member-status"
      axiosPut="/api/console/member-status"
      deleteMethod="memberStatus"
    />
  );
}

export default page;
