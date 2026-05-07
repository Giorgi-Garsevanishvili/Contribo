import AllowedStats from "@/(components)/adminComp/AllowedStats";
import LiveEvents from "@/(components)/adminComp/Events/LiveEvents";
import UpcomingEvents from "@/(components)/adminComp/Events/UpcomingEvents";
import EventStats from "@/(components)/adminComp/EventStats";
import HrWarningStats from "@/(components)/adminComp/HrWarningStats";
import JoinStats from "@/(components)/adminComp/JoinStats";
import UserStats from "@/(components)/adminComp/UserStats";

function Admin() {
  return (
    <div className="flex flex-col flex-wrap items-center my-3 justify-start gap-1">
      <div className="flex duration-300 transition-all ease-out flex-col w-full md:flex-row items-center justify-center gap-1">
        <UserStats />
        <JoinStats />
        <EventStats />
        <HrWarningStats />
        <AllowedStats />
      </div>
      <LiveEvents />
      <UpcomingEvents />
    </div>
  );
}
export default Admin;
