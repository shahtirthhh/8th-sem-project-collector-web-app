import { Context } from "../../store/context-values";
import React, { useContext, useEffect } from "react";

export default function Notification() {
  const notification_context = useContext(Context).notification;
  const setNotification_context = useContext(Context).setNotification;
  useEffect(() => {
    var timeout;
    if (!notification_context.loading) {
      timeout = setTimeout(() => {
        setNotification_context({
          color: null,
          data: null,
          loading: false,
        });
      }, 1500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [notification_context.color]);
  return (
    <div
      className={`transition-all duration-700 ease-in-out flex  z-20 w-screen h-8 pl-4 pt-1 absolute  justify-center gap-20 ${
        notification_context.color
          ? `opacity-100 bottom-[1vw] ${
              notification_context.color === "red"
                ? "bg-red-400"
                : notification_context.color === "blue"
                ? "bg-blue-400"
                : "bg-green-400"
            }`
          : "opacity-0 bottom-[-4vw]"
      }`}
    >
      {/* <span className="ml-4 font-semibold text-center">Error !</span> */}

      <span className="mr-4 font-semibold text-center">
        {notification_context.data
          ? notification_context.data
          : `                 `}
      </span>
    </div>
  );
}
