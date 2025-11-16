import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

import React from "react";

function eventRoles() {
  return (
    <MiniDashCard
      type="general"
      subType="regions"
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
