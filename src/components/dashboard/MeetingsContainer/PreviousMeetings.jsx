import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Context } from "../../../store/context-values";
const query_generator = (query) => {
  return {
    query,
  };
};
const today = new Date().getDate();
function PreviousMeetings() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;

  const [meetings, setMeetings] = useState(null);

  const fetchMeetings = useMemo(() => {
    return async () => {
      setNotification_context({
        color: "blue",
        data: "⏳ Getting data!",
        loading: true,
      });
      const res = await axios({
        method: "post", //you can set what request you want to be
        url: process.env.REACT_APP_API,
        data: query_generator(`
        {
          meetings{
            _id
            from
            date
            slot
            overview
            confirm
            cancel
            missed
            happen
          }
        }
      `),
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (res.data.errors) {
        setNotification_context({
          color: "red",
          data: "💀 Something went wrong !",
        });
      } else {
        setNotification_context({
          color: "blue",
          data: "⏳ Getting data!",
          loading: true,
        });
        const { data } = await axios({
          method: "post", //you can set what request you want to be
          url: process.env.REACT_APP_API,
          data: query_generator(`
          {
            citizens{
              _id
              email
            }
          }
        `),
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        res.data.data.meetings.map((meeting) => {
          meeting.from = data.data.citizens.find(
            (citizen) => citizen._id === meeting.from
          ).email;
        });
        const previousMeetings = res.data.data.meetings.filter((meeting) => {
          if (new Date(meeting.date).getDate() < today) {
            return meeting;
          }
        });
        setNotification_context({
          color: "green",
          data: "🎉 Updated just now !",
        });
        setMeetings(previousMeetings);
      }
    };
  }, []);
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);
  console.log(meetings);
  return (
    <div className="border-2 border-black  p-3 w-[50%] flex rounded-[2rem] bg-amber-50  flex-col justify-start items-center">
      {!meetings && <h2 className="font-bold text-center">💀 Error !</h2>}
      {meetings && meetings.length >= 1 && (
        <h2 className="font-bold text-center text-lg">⏮ Previous meetings</h2>
      )}
      {meetings && meetings.length < 1 && (
        <h2 className="font-bold text-center">No previous meetings !</h2>
      )}
      <div className="p-1 rounded-3xl overflow-y-auto scrollbar scrollbar-thumb-white scrollbar-w-2 flex flex-col gap-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent ">
        {meetings &&
          meetings.length >= 1 &&
          meetings.map((meeting) => (
            <div
              key={meeting._id}
              className={`border-2 border-black p-4 flex flex-col gap-2 rounded-3xl ${
                meeting.confirm
                  ? meeting.happen
                    ? "bg-emerald-200"
                    : "bg-yellow-200"
                  : meeting.cancel
                  ? "bg-rose-200"
                  : "bg-gray-200"
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium tracking-wider">
                  ⏰ {meeting.slot}
                </span>
                <span className="font-medium tracking-wider">
                  🗓 {meeting.date}
                </span>
              </div>
              <div className="flex gap-2">
                {meeting.cancel ? (
                  <span className="font-medium text-red-600">
                    😿was Canceled !
                  </span>
                ) : meeting.confirm ? (
                  <span
                    className={`font-medium ${
                      meeting.happen ? "text-green-600 " : "text-yellow-600"
                    }`}
                  >
                    {meeting.happen
                      ? "😸 Attended !"
                      : "was confirmed, but no-one joined ! 😑"}
                  </span>
                ) : (
                  meeting.missed && (
                    <span className="font-medium text-gray-600">
                      😓 You missed It !
                    </span>
                  )
                )}
              </div>
              <div>
                <span className="font-medium">📧 {meeting.from}</span>
              </div>
              {
                <span
                  className="whitespace-pre-line font-medium"
                  onDoubleClick={() =>
                    setAlertModal_context({
                      msg: meeting.overview,
                      visible: true,
                    })
                  }
                >
                  📝 {meeting.overview.slice(0, 100)}...
                </span>
              }
            </div>
          ))}
      </div>
    </div>
  );
}

export default PreviousMeetings;
