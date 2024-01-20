import { Context } from "../../store/context-values";
import React, { useContext } from "react";
function AlertModal() {
  const setAlertModalContext = useContext(Context).setAlertModal;
  const alertModalContext = useContext(Context).alertModal;
  return (
    <>
      {alertModalContext.visible && (
        <dialog className="z-20 w-full h-full absolute top-0 left-0 bg-black/25 backdrop-blur-md flex justify-center items-center">
          <div className="border max-h-[30rem] min-h-[10rem] rounded-xl bg-white/70 max-w-[60rem] min-w-[25rem] flex flex-col gap-3 justify-between items-center p-3 overflow-y-auto scrollbar scrollbar-thumb-white scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent ">
            <span className="text-lg  text-left font-bold whitespace-pre-line ">
              {alertModalContext.msg}
            </span>

            <button
              onClick={() => setAlertModalContext({ msg: "", visible: false })}
              className="hover:scale-105 hover:bg-blue-600 transition-all text-2xl border text-white bg-blue-400 border-black w-[9rem] rounded-lg h-[2.5rem] font-semibold"
            >
              OKAY
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}

export default AlertModal;
