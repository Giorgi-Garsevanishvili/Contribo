"use client";

import EventsListVolunteer from "@/(components)/userComp/events/EventsListVolunteer";

function EventsPage() {
  return (
    <>
      <div className=" flex flex-col mt-2 items-center justify-center ">
        <div className="flex items-center flex-col justify-center">
          <EventsListVolunteer />
        </div>
      </div>
    </>
  );
}
export default EventsPage;
