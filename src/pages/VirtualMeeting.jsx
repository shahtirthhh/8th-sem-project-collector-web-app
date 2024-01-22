import React, { useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Context } from "../store/context-values";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const query_generator = (query) => {
  return {
    query,
  };
};

const started_on = new Date();

function VirtualMeeting() {
  const ongoingMeeting_context = useContext(Context).ongoingMeeting;
  const token = useContext(Context).token;
  const setOngoingMeeting_context = useContext(Context).setOngoingMeeting;
  const setNotification_context = useContext(Context).setNotification;
  const socket_context = useContext(Context).socket;
  const socketObject_context = useContext(Context).socketObject;
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState();

  const navigate = useNavigate();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [time, setTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const calculateDuration = (currentTime) => {
    const startTime = new Date(started_on);
    const elapsedTime = currentTime - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    // Format the duration as HH:MM:SS
    const formattedDuration = `${hours}:${String(minutes % 60).padStart(
      2,
      "0"
    )}:${String(seconds % 60).padStart(2, "0")}`;
    return formattedDuration;
  };
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
        start_call();
      });
    setInterval(() => {
      const currentTime = new Date();
      setTime(currentTime.toLocaleTimeString());
      setDuration(calculateDuration(currentTime));
    }, 1000);
  }, []);

  const start_call = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: myVideo.current.srcObject,
    });
    peer.on("signal", (data) => {
      socketObject_context.emit("callUser", {
        userToCall: ongoingMeeting_context.from,
        signalData: data,
        from: socket_context,
      });
    });
    peer.on("stream", (stream) => {
      console.log(stream);
      userVideo.current.srcObject = stream;
    });
    socketObject_context.on("callAccepted", (data) => {
      console.log(data);
      setCallAccepted(true);
      peer.signal(data);
      // console.log(signal);
    });
    connectionRef.current = peer;
  };
  const update_meeting_status = async () => {
    setNotification_context({
      color: "blue",
      data: "⏳ Upadating meeting status...",
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            setMeetingAsHappened(meetingId:"${ongoingMeeting_context._id}")
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
    } else if (data.data.setMeetingAsHappened) {
      setNotification_context({
        color: "green",
        data: "💾 Updates saved !",
      });
    }
  };
  const end_meeting = () => {
    update_meeting_status();
    socketObject_context.emit("end-call", {
      citizen: ongoingMeeting_context.from,
    });
    myVideo.current.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    setOngoingMeeting_context(null);
    connectionRef.current = null;
    myVideo.current.srcObject = null;
    navigate("/dashboard");
  };

  return (
    <div className="flex border w-full border-black items-start h-[44rem] bg-slate-200 p-5 pt-20">
      <video
        ref={userVideo}
        autoPlay
        className="rounded-xl m-1 border-2 border-black"
        style={{ width: "40rem" }}
      />
      <div className="flex flex-col bg-white/80 rounded-xl border-2 border-black w-[40rem] h-[30rem] m-1 p-3 ">
        <div className="overflow-y-auto scrollbar scrollbar-thumb-slate-700 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent flex flex-col">
          <span className="font-bold text-lg">Meeting overview 📝</span>
          <span className="font-medium">{ongoingMeeting_context.overview}</span>
        </div>
      </div>
      <div className="flex flex-col items-center w-[30rem]  gap-3">
        <video
          autoPlay
          ref={myVideo}
          muted
          className="rounded-xl m-1 border-2 border-black"
          style={{ width: "25rem" }}
        ></video>
        {callAccepted && (
          <div className="flex flex-col w-full items-center gap-3 border-2 bg-white/70 border-black rounded-lg p-2">
            <span className="text-left  w-full px-5 font-medium text-lg">
              📆 {new Date().toDateString()}
            </span>
            <span className="text-left  w-full px-5 font-medium text-lg">
              🕔 {time}
            </span>
            <span className="text-left  w-full px-5 font-medium text-lg">
              📞 {duration}
            </span>
          </div>
        )}
        <button
          onClick={end_meeting}
          className="text-xl bg-red-200 text-black border-2 border-red-600 py-1 px-2 w-40 rounded-2xl m-2 font-semibold hover:bg-red-500 hover:scale-105 transition-all"
        >
          End meeting
        </button>
      </div>
    </div>
  );
}

export default VirtualMeeting;
