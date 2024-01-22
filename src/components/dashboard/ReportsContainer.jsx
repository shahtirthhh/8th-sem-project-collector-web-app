import React from "react";

import ActiveReports from "./ReportsContainer/ActiveReports";
import ProcessedReports from "./ReportsContainer/ProcessedReports";

function ComplaintsContainer() {
  return (
    <div className=" px-1 py-3 flex flex-row justify-between gap-5 h-[37.2rem] w-full">
      <ActiveReports />
      <ProcessedReports />
      {/* <Departments /> */}
    </div>
  );
}

export default ComplaintsContainer;
