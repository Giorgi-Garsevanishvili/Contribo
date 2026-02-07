import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

function eventRoles() {
  return (
    <MiniDashCard
      type="general"
      deleteMethod="eventRoles"
      detailPage="eventRoles"
      title="Event Role"
      searchKey={"name"}
      axiosGet="/api/console/eventRoles"
      axiosPost="/api/console/eventRoles"
    />
  );
}

export default eventRoles;
