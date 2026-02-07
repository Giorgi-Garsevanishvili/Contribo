import MiniDashCard from "@/(components)/panelComp/MiniDashCard";


function eventRoles() {
  return (
    <MiniDashCard
      type="general"
      deleteMethod="memberStatus"
      detailPage="memberStatus"
      title="Member Status"
      searchKey={"name"}
      axiosGet="/api/console/memberStatus"
      axiosPost="/api/console/memberStatus"
    />
  );
}

export default eventRoles;
