import React from "react";
function Waiting() {
  return (
    <dialog className="z-20 animate-wiggle w-full h-full absolute top-0 left-0  backdrop-blur-md flex flex-col gap-7 justify-center items-center">
      <span className="text-2xl text-white tracking-wide text-center font-bold whitespace-pre-line ">
        {`⏳ Waiting for the server initallize startup\nplease wait...`}
      </span>
    </dialog>
  );
}

export default Waiting;
