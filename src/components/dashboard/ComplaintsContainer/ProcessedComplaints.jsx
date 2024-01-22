import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/context-values";
import axios from "axios";
import Modal from "../../UI/Modal";
const query_generator = (query) => {
  return {
    query,
  };
};
const ProcessedComplaints = () => {
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
            complaints
            {
              _id
              date_of_submit
              seen
              from
              department
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

      setComplaints(data.data.complaints);
    }
  };
  return (
    <div className="border-2 border-black  p-3 w-[50%] flex rounded-[2rem] bg-amber-50  flex-col justify-start items-center">
      <div className=" w-full flex flex-col px-2 bg-amber-50  gap-5  rounded-[2.5rem] p-3">
        <span className="font-semibold text-2xl text-center">
          ✔ Processed complaints
        </span>
        {!complaints && (
          <span className="font-semibold text-lg text-center">
            ⌛ Loading...
          </span>
        )}
        {complaints && complaints.length < 1 && (
          <span className="font-bold text-lg text center">
            🧾 No Processed complaints !
          </span>
        )}
        {complaints && complaints.length >= 1 && (
          <div className="p-3 overflow-y-auto h-[30rem] rounded-lg scrollbar scrollbar-thumb-slate-400 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg">
            {/* Container for 1 card for beautful scrollbar */}
            <div className="flex flex-col gap-3">
              {complaints.map((complaint) => {
                if (complaint.processed) {
                  return (
                    <div
                      className={`border-2 h-min-[7rem] h-max-[5rem] border-black p-3 roundex-[2.5rem] gap-3 rounded-3xl flex flex-col bg-green-200`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-base text-center">
                          🗓 {complaint.date_of_submit}
                        </span>
                        <span className="font-medium text-base text-center">
                          📍 {complaint.location.slice(0, 20)}
                        </span>
                      </div>
                      <span className="font-medium text-base text-left">
                        {complaint.department}
                      </span>
                      <span className="font-medium text-base text-left">
                        📧 {complaint.from}
                      </span>

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

export default ProcessedComplaints;
