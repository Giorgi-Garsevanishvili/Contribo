import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

function eventRoles() {
  return (
    <MiniDashCard
      type="general"
      deleteMethod="position"
      detailPage="positions"
      title="Positions"
      searchKey={"name"}
      axiosGet="/api/console/positions"
      axiosPost="/api/console/positions"
    />
  );
}

export default eventRoles;
