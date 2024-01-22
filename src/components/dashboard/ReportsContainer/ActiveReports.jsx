import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/context-values";
import axios from "axios";
import Modal from "../../UI/Modal";
const query_generator = (query) => {
  return {
    query,
  };
};
const ActiveReports = () => {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;
  const [complaints, setComplaints] = useState(null);

  // const [showModal, setShowModal] = useState(false);
  // const [answer, setAnswer] = useState(null);
  // const [msg, setMsg] = useState("");
  useEffect(() => {
    fetchComplaints();
  }, []);
  const fetchComplaints = async () => {
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
            reports
            {
              _id
              date_of_submit
              seen
              
              
              content
              location
              under_review
              processed
              image
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
        data: "💀 Something went wrong !",
      });
    } else {
      setNotification_context({
        color: "green",
        data: "🙌🏻 Updated just now !",
      });

      setComplaints(data.data.reports);
    }
  };
  const set_as_processed = async (complaintId) => {
    setNotification_context({
      color: "blue",
      data: "✍🏻 Updating status...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            setAsProcessedReport(reportId:"${complaintId}")
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
      setNotification_context({
        color: "green",
        data: "📋 Updated just now !",
      });

      fetchComplaints();
    }
  };
  const set_as_under_review = async (complaintId) => {
    setNotification_context({
      color: "blue",
      data: "✍🏻 Updating status...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            setAsUnderReviewReport(reportId:"${complaintId}")
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
      setNotification_context({
        color: "green",
        data: "📋 Updated just now !",
      });

      fetchComplaints();
    }
  };
  return (
    <div className="border-2 border-black  p-3 w-[50%] flex rounded-[2rem] bg-amber-50  flex-col justify-start items-center">
      <div className=" w-full flex flex-col px-2 bg-amber-50  gap-5  rounded-[2.5rem] p-3">
        <span className="font-semibold text-2xl text-center">
          🏃🏻 Active reports
        </span>
        {!complaints && (
          <span className="font-semibold text-lg text-center">
            ⌛ Loading...
          </span>
        )}
        {complaints && complaints.length < 1 && (
          <span className="font-bold text-lg text-center">
            🧾 No active reports !
          </span>
        )}
        {complaints && complaints.length >= 1 && (
          <div className="p-3 overflow-y-auto h-[30rem] rounded-lg scrollbar scrollbar-thumb-slate-400 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg">
            {/* Container for 1 card for beautful scrollbar */}
            <div className="flex flex-col gap-3">
              {complaints.map((complaint) => {
                if (!complaint.processed) {
                  return (
                    <div
                      className={`border-2 h-min-[7rem] h-max-[5rem] border-black p-3 roundex-[2.5rem] gap-3 rounded-3xl flex flex-col ${
                        complaint.under_review ? "bg-blue-200" : "bg-yellow-200"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-base text-center">
                          🗓 {complaint.date_of_submit}
                        </span>
                        <span
                          className={`font-medium text-base text-center${
                            complaint.under_review
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {complaint.under_review
                            ? "🔍 Under review"
                            : "⏳ Pending"}
                        </span>

                        <span className="font-medium text-base text-center">
                          📍 {complaint.location.slice(0, 20)}
                        </span>
                      </div>

                      <span className="font-medium text-base text-left">
                        📧 Anonymous
                      </span>
                      <div className="flex gap-3">
                        {complaint.under_review ? (
                          <button
                            onClick={() => set_as_processed(complaint._id)}
                            className="text-sm hover:bg-green-500 hover:scale-105 transition-all bg-green-300 border-2 border-green-700  rounded-xl text-black font-semibold p-1"
                          >
                            Set as processed
                          </button>
                        ) : (
                          <button
                            onClick={() => set_as_under_review(complaint._id)}
                            className="text-sm hover:bg-blue-500 hover:scale-105 transition-all bg-blue-300 border-2 border-blue-700  rounded-xl text-black font-semibold p-1"
                          >
                            Set as under review
                          </button>
                        )}
                      </div>
                      <div className=" w-full">
                        <span
                          onDoubleClick={() => {
                            setAlertModal_context({
                              msg: complaint.content,
                              visible: true,
                            });
                          }}
                          className="font-medium text-base  whitespace-pre-line"
                        >
                          {complaint.content.slice(0, 50)} 💬
                        </span>
                      </div>
                      {complaint.image && complaint.image.length >= 1 && (
                        <div className=" flex gap-3 flex-wrap justify-between overflow-y-auto scrollbar scrollbar-thumb-slate-600 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg w-full">
                          {complaint.image.map((image) => {
                            return (
                              <img
                                src={image}
                                alt="image"
                                className="h-[8rem] w-[8rem] rounded-xl"
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveReports;
