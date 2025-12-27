import {
  closeConfirmTab,
  confirm,
  ConfirmTabState,
  setConfirmTab,
  terminate,
} from "@/redux/features/confirmationTab/confirmationTabSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

let resolver: ((value: boolean) => void) | null = null;

export const useConfirmTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const confirmState = useSelector(ConfirmTabState);

  const ask = (props: {
    title: string;
    message: string;
    value: string;
    opt1?: string;
    opt2?: string;
  }): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolver = resolve;

      dispatch(setConfirmTab({ ...props, isOpened: true }));
    });
  };

  const onConfirm = () => {
    dispatch(confirm());
    resolver?.(true);
    resolver = null;
  };

  const onReject = () => {
    dispatch(terminate());
    resolver?.(false);
    resolver = null;
  };

  useEffect(() => {
    if (!confirmState.isOpened) return;
    const timeout = setTimeout(() => {
      dispatch(closeConfirmTab());
      dispatch(terminate());
      resolver?.(false);
      resolver = null;
    }, 20000);
    return () => clearTimeout(timeout);
  }, [confirmState.isOpened, dispatch]);

  return { ask, onConfirm, onReject, confirmState };
};
