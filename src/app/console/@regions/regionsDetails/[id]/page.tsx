import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";
import React from "react";

function page() {
  
  return (
    <MiniDashDetails
      type="region"
      title="Regions"
      axiosGet="/api/console/regions"
      axiosPut="/api/console/regions"
      deleteMethod="region"
    />
  );
}

export default page;
