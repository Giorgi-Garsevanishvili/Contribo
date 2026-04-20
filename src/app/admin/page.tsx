import AllowedStats from "@/(components)/adminComp/AllowedStats";
import EventCard from "@/(components)/adminComp/Events/EventCard";
import UpcomingEvents from "@/(components)/adminComp/Events/UpcomingEvents";
import EventStats from "@/(components)/adminComp/EventStats";
import HrWarningStats from "@/(components)/adminComp/HrWarningStats";
import JoinStats from "@/(components)/adminComp/JoinStats";
import UserStats from "@/(components)/adminComp/UserStats";

function Admin() {
  return (
    <div className="mt-3 flex flex-col flex-wrap items-center justify-center gap-1">
      <div className="flex flex-wrap items-center justify-center gap-1">
        <UserStats />
        <JoinStats />
        <EventStats />
        <HrWarningStats />
        <AllowedStats />
      </div>
      <UpcomingEvents />
    </div>
  );
}
export default Admin;
