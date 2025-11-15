import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";
import React from "react";

function page() {
  return (
    <MiniDashDetails
      type="general"
      title="Positions"
      axiosGet="/api/console/positions"
      axiosPut="/api/console/positions"
      deleteMethod="position"
    />
  );
}

export default page;
