import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

function eventRoles() {
  return (
    <MiniDashCard
      type="general"
      deleteMethod="hrWarningsType"
      detailPage="hrWarningType"
      title="HR Warning type"
      searchKey={"name"}
      axiosGet="/api/console/hrWarningTypes"
      axiosPost="/api/console/hrWarningTypes"
    />
  );
}

export default eventRoles;
