import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

import React from "react";

function eventRoles() {
  return (
    <MiniDashCard
      type="general"
      deleteMethod="region"
      detailPage="regions"
      title="Regions"
      searchKey={"name"}
      axiosGet="/api/console/regions"
      axiosPost="/api/console/regions"
    />
  );
}

export default eventRoles;
