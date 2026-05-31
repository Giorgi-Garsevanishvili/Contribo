"use client";

import EventsListVolunteer from "@/(components)/userComp/events/EventsListVolunteer";

function EventsPage() {
  return (
    <div className="flex w-full md:w-[80%] items-center m-0 md:p-0 p-2 justify-center flex-col">
      <EventsListVolunteer />
    </div>
  );
}
export default EventsPage;
