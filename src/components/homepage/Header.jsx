import React from "react";
import modi_image from "../static/modi.png";
import bhupa_image from "../static/bhupa.png";
// bg-gradient-to-r from-teal-500 via-teal-200  to-teal-500
function Header() {
  return (
    <div className=" flex justify-center h-auto p-1 pb-3 bg-teal-300  w-full">
      {/* <img className="w-20 h-30" src={modi_image} alt="modi" /> */}
      <div className="flex flex-col justify-center">
        <span className="font-serif text-[2.25em] tracking-wider uppercase font-semibold ">
          Reporting and Resolution Portal
        </span>
        <span className="font-sans text-md font-semibold uppercase text-center tracking-wider">
          Collector of Rajkot
        </span>
      </div>
      {/* <img className="w-24 h-24" src={bhupa_image} alt="bhupa" /> */}
    </div>
  );
}

export default Header;
