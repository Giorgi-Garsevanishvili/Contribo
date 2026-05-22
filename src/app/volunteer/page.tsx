import LiveEventsVolunteer from "@/(components)/userComp/events/LiveEventsVolunteer";
import MyUpcomingEventsVolunteer from "@/(components)/userComp/events/MyUpcomingEvents";
import HomeEventStats from "@/(components)/userComp/HomeEventStats";
import WelcomeBack from "@/(components)/userComp/WelcomeBack";

async function Volunteer() {
  return (
    <div className="flex flex-col w-full flex-wrap items-center my-3 justify-start gap-2">
      <WelcomeBack />
      <HomeEventStats />
      <LiveEventsVolunteer />
      <MyUpcomingEventsVolunteer />
      <div className="flex duration-300 transition-all ease-out flex-col w-full md:flex-row items-center justify-center gap-1"></div>
    </div>
  );
}
export default Volunteer;
