import EventStats from "@/(components)/adminComp/EventStats";
import JoinStats from "@/(components)/adminComp/JoinStats";
import UserStats from "@/(components)/adminComp/UserStats";

function Admin() {
  return (
    <>
      <UserStats />;
      <JoinStats />
      <EventStats />
    </>
  );
}
export default Admin;
