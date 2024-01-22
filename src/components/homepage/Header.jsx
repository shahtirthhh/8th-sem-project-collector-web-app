import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "./../../store/context-values";

const query_generator = (query) => {
  return {
    query,
  };
};

function Header() {
  const token = useContext(Context).token;
  const socket = useContext(Context).socket;
  const setNotification_context = useContext(Context).setNotification;
  const ongoingMeeting_context = useContext(Context).ongoingMeeting;

  const [broadcasted, setBroadcasted] = useState(false);
  const change_status = async () => {
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            changeStatus(status:${broadcasted},socket:"${socket}")
          }
        `),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (data.errors) {
      setNotification_context({
        color: "red",
        data: "💀 Something went wrong !",
      });
    } else {
      data.data.changeStatus
        ? setNotification_context({
            color: "green",
            data: "🌐 Set as online !",
          })
        : setNotification_context({
            color: "green",
            data: "😴 Set as offline !",
          });
    }
  };
  useEffect(() => {
    // console.log(broadcasted);
    change_status();
  }, [broadcasted]);
  return (
    <div className=" flex justify-center h-auto p-1 pb-3 bg-amber-50 w-full">
      {/* <img className="w-20 h-30" src={modi_image} alt="modi" /> */}
      <div className="flex flex-col justify-center">
        <span className="font-serif text-[2.25em] tracking-wider uppercase font-semibold ">
          Reporting and Resolution Portal
        </span>
        <span className="font-sans text-md font-semibold uppercase text-center tracking-wider">
          Collector of Rajkot
        </span>
      </div>
      {!ongoingMeeting_context && (
        <div>
          {broadcasted ? (
            <button
              onClick={() => setBroadcasted(false)}
              className="fixed right-3 top-8 h-fit text-sm hover:bg-red-500 hover:scale-105 transition-all bg-red-300 border-2 border-red-700  rounded-xl text-black font-semibold p-1"
            >
              🔒 close connections
            </button>
          ) : (
            <button
              onClick={() => setBroadcasted(true)}
              className="fixed right-3 top-8 h-fit text-sm hover:bg-green-500 hover:scale-105 transition-all bg-green-300 border-2 border-green-700  rounded-xl text-black font-semibold p-1"
            >
              💻 I'm ready
            </button>
          )}
        </div>
      )}

      {/* <img className="w-24 h-24" src={bhupa_image} alt="bhupa" /> */}
    </div>
  );
}

export default Header;
