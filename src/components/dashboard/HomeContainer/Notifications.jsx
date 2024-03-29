import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Context } from "../../../store/context-values";

const query_generator = (query) => {
  return {
    query,
  };
};

function Notifications() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;

  const [meetings, setMeetings] = useState(null);
  const [complaints, setComplaints] = useState(null);
  const [reports, setReports] = useState(null);

  const fetchMeetings = useMemo(() => {
    return async () => {
      setNotification_context({
        color: "blue",
        data: "⏳ Getting data...",
        loading: true,
      });
      const { data } = await axios({
        method: "post", //you can set what request you want to be
        url: process.env.REACT_APP_API,
        data: query_generator(`
        {
          meetings{
            _id
            from
            date
            slot
            seen
          }
        }
      `),
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (data.errors) {
        setNotification_context({
          color: "red",
          data: "Something went wrong !",
        });
      } else {
        setNotification_context({
          color: "green",
          data: "🎉 Updated Just Now !",
        });
        const unseen_meetings = data.data.meetings.filter(
          (meeting) => !meeting.seen
        );
        setMeetings(unseen_meetings);
      }
    };
  }, []);
  const fetchComplaints = useMemo(() => {
    return async () => {
      const { data } = await axios({
        method: "post", //you can set what request you want to be
        url: process.env.REACT_APP_API,
        data: query_generator(`
        {
          complaints{
            _id
            location
            seen
            department
            location
          }
        }
      `),
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (data.errors) {
        setNotification_context({
          color: "red",
          data: "Something went wrong !",
        });
      } else {
        const unseen_complaints = data.data.complaints.filter(
          (complaint) => !complaint.seen
        );
        setComplaints(unseen_complaints);
      }
    };
  }, []);
  const fetchReports = useMemo(() => {
    return async () => {
      const { data } = await axios({
        method: "post", //you can set what request you want to be
        url: process.env.REACT_APP_API,
        data: query_generator(`
        {
          reports{
            _id
            seen
            location
          }
        }
      `),
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (data.errors) {
        setNotification_context({
          color: "red",
          data: "Something went wrong !",
        });
      } else {
        const unseen_reports = data.data.reports.filter(
          (report) => !report.seen
        );
        setReports(unseen_reports);
      }
    };
  }, []);
  const clear_all_notifications = async () => {
    setNotification_context({
      color: "blue",
      data: "🧼 clearing !",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: {
        query: `
            mutation($meetings:[InputMeeting],$complaints:[InputComplaint],$reports:[InputReport]){
              setNotificationsAsSeen(meetings:$meetings,complaints:$complaints,reports:$reports)
            }`,
        variables: {
          meetings,
          reports,
          complaints,
        },
      },
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
      setNotification_context({
        color: "green",
        data: "🧹 cleared !",
      });
      setMeetings(null);
      setComplaints(null);
      setReports(null);
      fetchMeetings();
      fetchComplaints();
      fetchReports();
    }
  };
  useEffect(() => {
    fetchMeetings();
    fetchComplaints();
    fetchReports();
  }, []);
  return (
    <div className="border-2 border-black gap-2 p-3 w-[33.33%] flex rounded-[2rem] bg-amber-50  flex-col  items-center">
      {(!meetings || !complaints || !reports) && (
        <h1 className="font-medium text-center">⌛ Loading...</h1>
      )}
      {meetings &&
        complaints &&
        reports &&
        meetings.length < 1 &&
        complaints.length < 1 &&
        reports.length < 1 && (
          <h1 className="font-medium text-center">📩 Inbox Empty !</h1>
        )}
      {/* Meetings */}
      {((meetings && meetings.length >= 1) ||
        (reports && reports.length >= 1) ||
        (complaints && complaints.length >= 1)) && (
        <button
          onClick={clear_all_notifications}
          className=" rounded-xl transition-all font-medium duration-300 p-1 hover:after:content-['clear_all'] hover:bg-red-300 "
        >
          ❌
        </button>
      )}
      {meetings &&
      complaints &&
      reports &&
      (meetings.length >= 1 ||
        reports.length >= 1 ||
        complaints.length >= 1) ? (
        <div className="w-full h-full flex flex-col gap-2">
          <ul className="border-2 rounded-[2rem] bg-orange-200 border-black p-3  w-full h-[33.33%]">
            <h1 className="font-bold text-center w-full ">🤝🏻 Meetings</h1>
            <div className="flex rounded-[2rem] h-[90%] flex-col justify-center overflow-y-auto scrollbar scrollbar-thumb-white scrollbar-w-2 gap-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent ">
              {meetings && meetings.length >= 1 ? (
                meetings.map((meeting) => {
                  return (
                    <li
                      key={meeting._id}
                      className="text-left m-1 font-medium tracking-wide"
                    >
                      • {new Date(meeting.date).toDateString()} — {meeting.slot}
                    </li>
                  );
                })
              ) : (
                <span className="font-medium text-center">📭 Empty ! </span>
              )}
            </div>
          </ul>

          {/* Complaints */}

          <ul className="border-2 border-black bg-pink-300  p-3 h-[33.33%] w-full flex rounded-[2rem]  flex-col justify-start ">
            <h1 className="font-bold text-center">😡 Complaints</h1>
            <div className="flex rounded-[2rem] h-[90%] flex-col justify-center  overflow-y-auto scrollbar scrollbar-thumb-white scrollbar-w-2 gap-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent ">
              {complaints && complaints.length >= 1 ? (
                complaints.map((complaint) => (
                  <li
                    key={complaint._id}
                    className="text-left m-1 font-medium tracking-wide"
                  >
                    • {complaint.location.slice(0, 11)}... -{" "}
                    {complaint.department} department
                  </li>
                ))
              ) : (
                <span className="font-medium text-center">📭 Empty ! </span>
              )}
            </div>
          </ul>

          {/* Reports */}

          <ul className="border-2 bg-indigo-200 border-black  p-3 h-[33.33%] w-full flex rounded-[2rem]  flex-col justify-start ">
            <h1 className="font-bold text-center">🕵🏻‍♀️ Reports</h1>
            <div className="flex rounded-[2rem] h-[90%] flex-col justify-center overflow-y-auto scrollbar scrollbar-thumb-white scrollbar-w-2 gap-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent ">
              {reports && reports.length >= 1 ? (
                reports.map((report) => <li key={report._id}>new Report</li>)
              ) : (
                <span className="font-medium text-center">📭 Empty ! </span>
              )}
            </div>
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Notifications;
