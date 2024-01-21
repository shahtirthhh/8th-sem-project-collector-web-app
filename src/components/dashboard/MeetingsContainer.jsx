import React, { useContext, useEffect, useMemo, useState } from "react";
import NextMeetings from "./MeetingsContainer/NextMeetings";
import PreviousMeetings from "./MeetingsContainer/PreviousMeetings";
const query_generator = (query) => {
  return {
    query,
  };
};
function MeetingsContainer() {
  return (
    <div className=" px-1 py-3 flex flex-row justify-between gap-5 h-[37.2rem] w-full">
      <NextMeetings />
      <PreviousMeetings />
    </div>
  );
}

export default MeetingsContainer;
