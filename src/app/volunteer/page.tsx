import LiveEventsVolunteer from "@/(components)/userComp/events/LiveEventsVolunteer";
import MyOldEventsVolunteer from "@/(components)/userComp/events/MyOldEvents";
import MyUpcomingEventsVolunteer from "@/(components)/userComp/events/MyUpcomingEvents";
import UpcomingEventsVolunteer from "@/(components)/userComp/events/UpcomingEventsVolunteer";
import WelcomeBack from "@/(components)/userComp/events/WelcomeBack";

async function Volunteer() {
  return (
    <div className="flex flex-col w-full flex-wrap items-center my-3 justify-start gap-1">
      <WelcomeBack />
      <LiveEventsVolunteer />
      <MyUpcomingEventsVolunteer />
      <MyOldEventsVolunteer />
      <div className="flex duration-300 transition-all ease-out flex-col w-full md:flex-row items-center justify-center gap-1"></div>
    </div>
  );
}
export default Volunteer;
