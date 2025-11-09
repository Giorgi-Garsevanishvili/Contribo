import { useSelector } from "react-redux";
import { alertState } from "./componentAlertSlice";

import Alerts from "@/(components)/generalComp/Alerts";

export const CompAlert = () => {
  const compAlertState = useSelector(alertState);

  return (
    <div>
      <Alerts {...compAlertState} />
    </div>
  );
};
