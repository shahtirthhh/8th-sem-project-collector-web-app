import React from "react";

import LeftContainer from "../components/homepage/LeftContainer";
import RightContainer from "../components/homepage/RightContainer";
import Header from "../components/homepage/Header";
function HomePage() {
  return (
    <>
      <Header />
      <div className="flex flex-row overflow-y-hidden ">
        <LeftContainer />
        <RightContainer />
      </div>
    </>
  );
}

export default HomePage;
