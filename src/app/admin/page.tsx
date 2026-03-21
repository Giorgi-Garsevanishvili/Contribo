import AllowedStats from "@/(components)/adminComp/AllowedStats";
import EventStats from "@/(components)/adminComp/EventStats";
import HrWarningStats from "@/(components)/adminComp/HrWarningStats";
import JoinStats from "@/(components)/adminComp/JoinStats";
import UserStats from "@/(components)/adminComp/UserStats";

function Admin() {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-1">
      <UserStats />
      <JoinStats />
      <EventStats />
      <HrWarningStats />
      <AllowedStats/>
    </div>
  );
}
export default Admin;
