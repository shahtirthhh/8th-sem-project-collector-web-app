import React, { useState } from "react";

export const Context = React.createContext({
  token: null,
  setToken: (token) => {},
  socket: null,
  setSocket: (socket) => {},
  socketObject: null,
  setSocketObject: (socket) => {},
  notification: { color: null, data: null },
  setNotification: ({ color, data, loading = false }) => {},
  alertModal: { msg: "", visible: "" },
  setAlertModal: ({ msg, visible }) => {},
});
// eslint-disable-next-line
export default (props) => {
  const [tokenValue, setTokenValue] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRoYWJ1MjIxMkBnbWFpbC5jb20iLCJfaWQiOiI2NWExNDEwZjliNDRmZTE0ZDc1OGQ4NTMiLCJpYXQiOjE3MDU3NTk5NjEsImV4cCI6MTcwNTg0NjM2MX0.FcAQr_M2f4POQhdHtdiErWfxovBVZ66ZuyTecgeHmGE"
  );
  const [socketObjectValue, setSocketObjectValue] = useState(null);
  const [socketValue, setSocketValue] = useState(null);
  const [notificationValue, setNotificationValue] = useState({
    color: "null",
    data: "null",
    loading: false,
  });
  const [alertModalValue, setAlertModalValue] = useState({
    msg: "",
    visible: false,
  });
  return (
    <Context.Provider
      value={{
        token: tokenValue,
        socket: socketValue,
        socketObject: socketObjectValue,
        notification: notificationValue,
        alertModal: alertModalValue,
        setToken: setTokenValue,
        setSocket: setSocketValue,
        setNotification: setNotificationValue,
        setSocketObject: setSocketObjectValue,
        setAlertModal: setAlertModalValue,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
