import {
  fetchRegions,
  fetchRoles,
  getAllRegion,
  getAllRoles,
  regionLoading,
  rolesLoading,
} from "@/redux/features/allowedUsers/allowedRoleSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

function useRegionRole() {
  const dispatch = useDispatch<AppDispatch>();
  const loadingRoles = useSelector(rolesLoading); // "idle" | "pending" | "fulfilled" | "rejected"
  const loadingRegions = useSelector(regionLoading);
  const roles = useSelector(getAllRoles);
  const regions = useSelector(getAllRegion);

  const loadingHook =
    loadingRegions === "pending" || loadingRoles === "pending";

  const refetchRoles = () => {
    dispatch(fetchRoles());
  };
  const refetchRegions = () => {
    dispatch(fetchRegions());
  };

  return { loadingHook, roles, regions, refetchRegions, refetchRoles };
}

export default useRegionRole;
