import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Context } from "../../store/context-values";

const query_generator = (query) => {
  return {
    query,
  };
};

function NoticeContainer() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;

  const [notices, setNotices] = useState(null);
  const [addNoticeVisible, setAddNoticeVisible] = useState(false);
  const [newNoticeData, setNewNoticeData] = useState("");

  const publishNewNotice = async () => {
    setAddNoticeVisible(false);
    setNotification_context({
      color: "blue",
      data: "Publishing...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            publishNotice(content:"""${newNoticeData}"""){
              _id
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
        data: "Published !",
      });
      setNewNoticeData("");
      fetchNotices();
    }
  };

  const fetchNotices = useMemo(() => {
    return async () => {
      setNotification_context({
        color: "blue",
        data: "Getting latest data...",
        loading: true,
      });
      const { data } = await axios({
        method: "post", //you can set what request you want to be
        url: process.env.REACT_APP_API,
        data: query_generator(`
            {
              notices{
                _id
                announcement_date
                content
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
          data: "Data loaded !",
        });
        setNotices(data.data.notices);
      }
    };
  }, []);

  useEffect(() => {
    fetchNotices();
  }, []);
  return (
    <div className="p-1 h-72 flex">
      {/* Notice Board */}
      <div className=" p-1 h-ful w-full flex justify-center items-center">
        {notices && notices.length < 1 && (
          <h2 className=" font-bold text-center">Empty Notice board !</h2>
        )}
        {notices && notices.length >= 1 && (
          <div className="flex w-full h-full flex-wrap overflow-y-auto ">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="border border-neutral-800 m-1 p-1 flex flex-col w-48 h-48 rounded-md overflow-auto"
              >
                <span className="text-[0.6rem] font-semibold text-neutral-500 border-b border-slate-200 pb-[0.10rem]">
                  {notice.announcement_date}
                </span>
                <span className="whitespace-pre-line text-xs ">
                  {notice.content}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Add New notice */}
      {addNoticeVisible && (
        <div className="border p-1 h-full border-black rounded-md w-64 flex flex-col items-center">
          <textarea
            onChange={(event) => setNewNoticeData(event.target.value)}
            minLength={10}
            rows={10}
            cols={30}
            className="border border-slate-500 rounded-md text-xs p-1 mb-2"
            placeholder="Type here..."
          ></textarea>
          {newNoticeData.trim().length > 10 && (
            <button
              onClick={publishNewNotice}
              className="border border-black-300 text-xs font-bold p-1 rounded-md"
            >
              Publish
            </button>
          )}
        </div>
      )}
      <button
        onClick={() => setAddNoticeVisible(!addNoticeVisible)}
        className="border border-black-300 text-xs font-bold w-auto px-1 mx-1 h-5"
      >
        {addNoticeVisible ? "Close" : "+"}
      </button>
    </div>
  );
}

export default NoticeContainer;
