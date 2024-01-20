import React from "react";

import Notes from "./HomeContainer/Notes";
import Notifications from "./HomeContainer/Notifications";
import UpcomingMeetings from "./HomeContainer/UpcomingMeetings";

function HomeContainer() {
  return (
    <div className=" px-1 py-3 flex flex-row justify-between gap-5 h-[37.2rem] w-full">
      <Notes />
      <UpcomingMeetings />
      <Notifications />
    </div>
  );
}

export default HomeContainer;
