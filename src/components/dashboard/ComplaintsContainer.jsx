import React from "react";
import ActiveComplaints from "./ComplaintsContainer/ActiveComplaints";
import ProcessedComplaints from "./ComplaintsContainer/ProcessedComplaints";
import Departments from "./ComplaintsContainer/Departments";

function ComplaintsContainer() {
  return (
    <div className=" px-1 py-3 flex flex-row justify-between gap-5 h-[37.2rem] w-full">
      <ActiveComplaints />
      <ProcessedComplaints />
      {/* <Departments /> */}
    </div>
  );
}

export default ComplaintsContainer;
