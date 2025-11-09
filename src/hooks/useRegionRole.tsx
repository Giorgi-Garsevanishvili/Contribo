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
  const loadingRoles = useSelector(rolesLoading);
  const loadingRegions = useSelector(regionLoading);
  //const rolesErrorMsg = useSelector(rolesError);
  //const regionErrorMsg = useSelector(regionsError);
  const roles = useSelector(getAllRoles);
  const regions = useSelector(getAllRegion);

  const isLoading = loadingRegions === "pending" || loadingRoles === "pending";
  //const error = rolesErrorMsg || regionErrorMsg;

  useEffect(() => {
    if (roles.length === 0) dispatch(fetchRoles());
    if (regions.length === 0) dispatch(fetchRegions());
  }, [dispatch, roles, regions]);

  return { isLoading, roles, regions };
}

export default useRegionRole;
