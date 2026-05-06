import AllowedStats from "@/(components)/adminComp/AllowedStats";
import LiveEvents from "@/(components)/adminComp/Events/LiveEvents";
import UpcomingEvents from "@/(components)/adminComp/Events/UpcomingEvents";
import EventStats from "@/(components)/adminComp/EventStats";
import HrWarningStats from "@/(components)/adminComp/HrWarningStats";
import JoinStats from "@/(components)/adminComp/JoinStats";
import UserStats from "@/(components)/adminComp/UserStats";

function Admin() {
  return (
    <div className="flex flex-col p-3 md:flex-row items-center md:items-start justify-center my-3 gap-10">
      <div className="flex flex-col flex-wrap items-center justify-start gap-1">
        <div className="flex flex-wrap items-center justify-center gap-1">
          <UserStats />
          <JoinStats />
          <EventStats />
          <HrWarningStats />
          <AllowedStats />
        </div>
        <LiveEvents />
        <UpcomingEvents />
      </div>
    </div>
  );
}
export default Admin;
