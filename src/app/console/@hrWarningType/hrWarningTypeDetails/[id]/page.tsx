import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";
import React from "react";

function page() {
  return (
    <MiniDashDetails
      type="general"
      title="HR Warning Type Details"
      axiosGet="/api/console/hr-warning-type"
      axiosPut="/api/console/hr-warning-type"
      deleteMethod="hrWarningsType"
    />
  );
}

export default page;
