import React from "react";

function Modal({ msg, showModal, onAnswer }) {
  return (
    <>
      {showModal && (
        <dialog className="w-full h-full absolute top-0 left-0 bg-black/25 backdrop-blur-md flex justify-center items-center">
          <div className="border rounded-xl bg-white/70 w-2/5 h-1/3 flex flex-col gap-3 justify-evenly">
            <span className="text-2xl text-center font-bold">{msg}</span>
            <div className="flex flex-row mt-20 justify-center">
              <button
                onClick={() => onAnswer(true)}
                className="text-xl border-2 text-black bg-green-200 border-green-600 py-1 px-2 w-32 rounded-lg m-2 font-semibold hover:bg-green-500 hover:scale-105 transition-all"
              >
                CONFIRM
              </button>
              <button
                onClick={() => onAnswer(false)}
                className="text-xl bg-red-200 text-black border-2 border-red-600 py-1 px-2 w-32 rounded-lg m-2 font-semibold hover:bg-red-500 hover:scale-105 transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

export default Modal;
