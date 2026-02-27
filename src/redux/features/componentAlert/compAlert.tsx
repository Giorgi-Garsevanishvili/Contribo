"use client";
import { useSelector } from "react-redux";
import { alertState } from "./componentAlertSlice";

import Alerts from "@/(components)/generalComp/Alerts";

export const CompAlert = () => {
  const compAlertState = useSelector(alertState);

  return (
    <div className={`fixed ${compAlertState.isOpened ? "min-w-[20rem] min-h-20" : "" }  z-10 top-3 w-0 h-0 right-0 m-0 p-0`}>
      <Alerts {...compAlertState} />
    </div>
  );
};
