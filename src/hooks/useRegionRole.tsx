import { useEffect } from "react";
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

  const isLoading = loadingRegions === "pending" || loadingRoles === "pending";

  useEffect(() => {
    if (roles.length === 0 && loadingRoles !== "pending") {
      dispatch(fetchRoles());
    }
    if (regions.length === 0 && loadingRegions !== "pending") {
      dispatch(fetchRegions());
    }
  }, [dispatch, roles.length, regions.length, loadingRoles, loadingRegions]);

  return { isLoading, roles, regions };
}

export default useRegionRole;
