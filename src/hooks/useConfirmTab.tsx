import { ConfirmProp } from "@/redux/features/confirmationTab/confirmationTab";
import {
  closeConfirmTab,
  ConfirmTabState,
  setConfirmTab,
  terminate,
} from "@/redux/features/confirmationTab/confirmationTabSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useConfirmTab = () => {
  const dispatchConfirmComponent = useDispatch<AppDispatch>();
  const confirmTabState = useSelector(ConfirmTabState);

  const triggerConfirmTab = ({
    message,
    isOpened,
    title,
    opt1,
    opt2,
  }: ConfirmProp) => {
    dispatchConfirmComponent(
      setConfirmTab({
        message,
        title,
        isOpened,
        opt1,
        opt2,
      })
    );
  };

  useEffect(() => {
    if (!confirmTabState.isOpened) return;
    const compTimeoutId = setTimeout(() => {
      dispatchConfirmComponent(closeConfirmTab());
      dispatchConfirmComponent(terminate());
    }, 5000);
    return () => clearTimeout(compTimeoutId);
  }, [confirmTabState.isOpened, dispatchConfirmComponent]);

  return { triggerConfirmTab };
};
