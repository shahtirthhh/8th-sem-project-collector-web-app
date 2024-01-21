import React, { useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Context } from "../store/context-values";
function VirtualMeeting() {
  const ongoingMeeting_context = useContext(Context).ongoingMeeting;
  const socket_context = useContext(Context).socket;
  const socketObject_context = useContext(Context).socketObject;
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
        start_call();
      });
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
      // setCallAccepted(true);
      peer.signal(data);
      // console.log(signal);
    });
    connectionRef.current = peer;
  };

  return (
    <div>
      {/* {!callAccepted && <button onClick={callUser}>Start Call</button>} */}
      <video autoPlay ref={myVideo} muted style={{ width: "300px" }}></video>
      <video ref={userVideo} autoPlay style={{ width: "300px" }} />
      {/* {callAccepted && <button>End Call</button>} */}
    </div>
  );
}

export default VirtualMeeting;
