import AllowedStats from "@/(components)/adminComp/AllowedStats";
import EventStats from "@/(components)/adminComp/EventStats";
import HrWarningStats from "@/(components)/adminComp/HrWarningStats";
import JoinStats from "@/(components)/adminComp/JoinStats";
import UserStats from "@/(components)/adminComp/UserStats";

function Admin() {
  return (
    <>
      <UserStats />
      <JoinStats />
      <EventStats />
      <HrWarningStats />
      <AllowedStats/>
    </>
  );
}
export default Admin;
