import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

import React from "react";

function eventRoles() {
  return (
    <MiniDashCard
      type="roles"
      deleteMethod="role"
      detailPage="roles"
      title="Roles"
      searchKey={"name"}
      axiosPost="/api/console/roles"
      axiosGet="/api/console/regions"
    />
  );
}

export default eventRoles;
