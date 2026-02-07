import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

function eventRoles() {
  return (
    <MiniDashCard
      type="regions"
      deleteMethod="region"
      detailPage="regions"
      title="Regions"
      searchKey={"name"}
      axiosPost="/api/console/regions"
      axiosGet="/api/console/regions"
    />
  );
}

export default eventRoles;
