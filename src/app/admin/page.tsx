import JoinStats from "@/(components)/adminComp/JoinStats";
import UserStats from "@/(components)/adminComp/UserStats";

function Admin() {
  return (
    <>
      <UserStats />;
      <JoinStats />
    </>
  );
}
export default Admin;
