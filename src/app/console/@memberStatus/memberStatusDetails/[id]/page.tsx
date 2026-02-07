import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

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
