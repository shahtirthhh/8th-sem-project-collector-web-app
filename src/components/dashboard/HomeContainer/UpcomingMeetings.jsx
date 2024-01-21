import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../../../store/context-values";
import InputModal from "../../UI/InputModal";
import Modal from "../../UI/Modal";
import { useNavigate } from "react-router-dom";

const query_generator = (query) => {
  return {
    query,
  };
};
const today = new Date().getDate();
function UpcomingMeetings() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;
  const setOngoingMeeting_context = useContext(Context).setOngoingMeeting;
  const socketObject_context = useContext(Context).socketObject;

  const navigate = useNavigate();

  const [meetings, setMeetings] = useState(null);
  const [reason, setReason] = useState("");

  const [citizen, setCitizen] = useState(null);
  const [citizenSocket, setCitizenSocket] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [msg, setMsg] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAnswer, setConfirmAnswer] = useState(null);
  const [Confirmmsg, setConfirmMsg] = useState("");

  const [cancelMeeting, setCancelMeeting] = useState(null);
  const [confirmMeeting, setConfirmMeeting] = useState(null);

  const [meetingsToday, setMeetingsToday] = useState(null);
  const [ongoingMeeting, setOngoingMeeting] = useState(null);

  useEffect(() => {
    socketObject_context.on("citizen-ready-to-join", (data) => {
      setNotification_context({
        color: "blue",
        data: `${data.citizen_email} wants to join ! 👤`,
      });
      setCitizen(data.citizen_email);
      setCitizenSocket(data.citizen);
    });
  }, [socketObject_context]);

  const join_meeting = () => {};

  const proceed_to_confirm_meeting = async () => {
    setNotification_context({
      color: "blue",
      data: "⏳ Confirming...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            confirmMeeting(id:"${confirmMeeting._id}")
          }
        `),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // console.log(data);
    if (data.errors) {
      setNotification_context({
        color: "red",
        data: "💀 Something went wrong !",
      });
    } else if (data.data.confirmMeeting) {
      setNotification_context({
        color: "green",
        data: "🎃 Confirmed !",
      });
      fetchMeetings();
    }
  };
  const proceed_to_cancel_meeting = async () => {
    setNotification_context({
      color: "blue",
      data: "😿 Canceling...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            cancelMeeting(id:"${cancelMeeting._id}",reason_to_cancel:"${reason}")
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
    } else if (data.data.cancelMeeting) {
      setNotification_context({
        color: "green",
        data: "😭 Canceled !",
      });
      fetchMeetings();
    }
  };
  useEffect(() => {
    if (confirmAnswer) {
      setShowConfirmModal(false);
      setConfirmAnswer(null);
      proceed_to_confirm_meeting();
    } else {
      setConfirmMeeting(null);
      setShowConfirmModal(false);
      setConfirmAnswer(null);
    }
  }, [confirmAnswer]);

  useEffect(() => {
    if (answer) {
      setShowModal(false);
      setAnswer(null);
      setReason("");
      proceed_to_cancel_meeting();
    } else {
      setShowModal(false);
      setAnswer(null);
      setReason("");
      setCancelMeeting(null);
    }
  }, [answer]);

  const fetchMeetings = useMemo(() => {
    return async () => {
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
          data: "☠ Something went wrong !",
        });
      } else {
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
        setMeetingsToday(
          res.data.data.meetings.filter((meeting) => {
            if (new Date(meeting.date).getDate() === today) {
              return meeting;
            }
          })
        );
        setMeetings(res.data.data.meetings);
      }
    };
  }, []);
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);
  return (
    <div className="border-2 border-black  p-3 w-[33.33%] flex rounded-[2rem] bg-fuchsia-200  flex-col justify-start items-center">
      {!meetings && <h2 className="font-bold text-center">💀 Error !</h2>}
      {meetingsToday && meetingsToday.length < 1 && (
        <h2 className="font-bold text-center">No upcoming meetings !</h2>
      )}
      <div className="p-1 rounded-3xl overflow-y-auto scrollbar scrollbar-thumb-white scrollbar-w-2 flex flex-col gap-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent ">
        {meetings &&
          meetings.length > 1 &&
          meetings.map((meeting) => {
            if (new Date(meeting.date).getDate() === today) {
              return (
                <div
                  key={meeting._id}
                  className={`border-2 border-black p-4 flex flex-col gap-2 rounded-3xl ${
                    meeting.confirm
                      ? "bg-emerald-200"
                      : meeting.cancel
                      ? "bg-rose-200"
                      : "bg-sky-200"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium tracking-wider">
                      ⏰ {meeting.slot}
                    </span>
                    {meeting.from === citizen && (
                      <button
                        onClick={() => {
                          meeting.from = citizenSocket;
                          setOngoingMeeting_context(meeting);
                          navigate("virtual-meeting");
                        }}
                        className="text-sm hover:bg-green-500 hover:scale-105 transition-all bg-green-300 border-2 border-green-700  rounded-xl text-black font-semibold p-1"
                      >
                        📞 Accept
                      </button>
                    )}
                    <div className="flex gap-2">
                      {meeting.cancel ? (
                        <span className="font-medium text-red-600">
                          😿 Canceled !
                        </span>
                      ) : (
                        !meeting.confirm && (
                          <button
                            onClick={() => {
                              setMsg("Please provide a reason to cancel.");
                              setShowModal(true);
                              setCancelMeeting(meeting);
                            }}
                            className="text-sm hover:bg-red-500 hover:scale-105 transition-all bg-red-300 border-2 border-red-700  rounded-xl text-black font-semibold p-1"
                          >
                            🙅🏻‍♂️ Cancel
                          </button>
                        )
                      )}
                      {meeting.confirm ? (
                        <span className="font-medium text-green-600">
                          😸 Confirmed !
                        </span>
                      ) : (
                        !meeting.cancel && (
                          <button
                            onClick={() => {
                              setConfirmMsg(
                                "Are you sure to confirm the meeting ❓"
                              );
                              setShowConfirmModal(true);
                              setCancelMeeting(meeting);
                              setConfirmMeeting(meeting);
                            }}
                            className="text-sm hover:bg-green-500 hover:scale-105 transition-all bg-green-300 border-2 border-green-700  rounded-xl text-black font-semibold p-1"
                          >
                            🙋🏻‍♂️ Confirm
                          </button>
                        )
                      )}
                    </div>
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
                  {/* {meeting.want_to_cancel && (
                    <textarea className="font medium"></textarea>
                  )} */}
                </div>
              );
            } else {
              return null;
            }
          })}
      </div>
      <InputModal
        minCharacters={25}
        msg={msg}
        showModal={showModal}
        onAnswer={setAnswer}
        onReasonChange={setReason}
      />
      <Modal
        msg={Confirmmsg}
        showModal={showConfirmModal}
        onAnswer={setConfirmAnswer}
      />
    </div>
  );
}

export default UpcomingMeetings;
