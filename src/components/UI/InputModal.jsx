import React, { useState } from "react";

function InputModal({
  msg,
  showModal,
  onAnswer,
  onReasonChange,
  minCharacters,
}) {
  const [text, setText] = useState("");
  return (
    <>
      {showModal && (
        <dialog className="w-full h-full absolute top-0 left-0 bg-black/25 backdrop-blur-md flex justify-center items-center">
          <div className="border rounded-xl bg-white/70 w-2/5 h-1/3 flex flex-col p-2 justify-around">
            <div className="flex border items-center justify-center flex-col gap-2">
              <input
                className="w-80 p-1 text-lg rounded-lg border-2 border-black"
                type="text"
                onChange={(event) => {
                  setText(event.target.value);
                  onReasonChange(event.target.value);
                }}
                placeholder={msg}
                name="reason"
              ></input>
              <span className="text-base text-center font-semibold">
                {text.trim().length >= minCharacters
                  ? "🙌🏻"
                  : "⚠ At least 25 characters !"}
              </span>
            </div>
            <div className="flex flex-row mt-20 justify-center">
              {text.trim().length >= minCharacters && (
                <button
                  onClick={() => {
                    setText("");
                    onAnswer(true);
                  }}
                  className="text-xl border-2 text-black bg-green-200 border-green-600 py-1 px-2 w-32 rounded-lg m-2 font-semibold hover:bg-green-500 hover:scale-105 transition-all"
                >
                  CONFIRM
                </button>
              )}
              <button
                onClick={() => {
                  setText("");
                  onAnswer(false);
                }}
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

export default InputModal;
