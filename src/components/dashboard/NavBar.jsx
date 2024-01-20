import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Modal from "../UI/Modal";

function NavBar() {
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);
  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);
  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [msg, setMsg] = useState("");
  const [time, setTime] = useState("");
  useEffect(() => {
    {
      setInterval(() => {
        setTime(new Date().toTimeString());
      }, 1000);
    }
  }, []);
  useEffect(() => {
    if (answer) {
      setShowModal(false);
      setAnswer(null);
      logout();
    } else {
      setShowModal(false);
      setAnswer(null);
    }
  }, [answer]);
  const logout = () => {
    window.location.reload();
  };
  return (
    <div className="flex border-t-2 border-black justify-between w-full px-2 bg-teal-300">
      {/*emarald-200*/}
      <span className="text-lg font-semibold w-48 tracking-wider">
        🗓 {new Date().toDateString()}
      </span>
      <ul className=" flex flex-row gap-9 px-9 ">
        <li
          className={`text-md font-medium  px-2 py-1  ${
            pathname === "/dashboard" ? "bg-teal-500 rounded-b-lg" : ""
          }`}
        >
          <Link to="/dashboard" className="">
            Home
          </Link>
        </li>
        <li
          className={`transition-all hover:bg-teal-200 hover:rounded-b-lg  duration-500 text-md font-medium px-2 py-1 ${
            pathname === "/dashboard/meetings"
              ? "bg-teal-500   rounded-b-lg"
              : ""
          }`}
        >
          <Link to="meetings" className="">
            Meetings
          </Link>
        </li>
        <li
          className={`transition-all hover:bg-teal-200 hover:rounded-b-lg  duration-500 text-md font-medium px-2 py-1  ${
            pathname === "/dashboard/complaints"
              ? "bg-teal-500 rounded-b-lg"
              : ""
          }`}
        >
          <Link to="complaints" className="">
            Complaints
          </Link>
        </li>
        <li
          className={`transition-all hover:bg-teal-200 hover:rounded-b-lg  duration-500 text-md font-medium px-2 py-1 ${
            pathname === "/dashboard/notice-board"
              ? "bg-teal-500 rounded-b-lg"
              : ""
          }`}
        >
          <Link to="notice-board" className="">
            Notice Board
          </Link>
        </li>
        <li
          className={`transition-all hover:bg-teal-200 hover:rounded-b-lg  duration-500 text-md font-medium px-2 py-1  ${
            pathname === "/dashboard/reports-activities"
              ? "bg-teal-500 rounded-b-lg"
              : ""
          }`}
        >
          <Link to="reports-activities" className="">
            Reports
          </Link>
        </li>
        <li
          className={`transition-all hover:bg-teal-200 hover:rounded-b-lg  duration-500 text-md font-medium px-2 py-1  ${
            pathname === "/dashboard/success-stories"
              ? "bg-teal-500 rounded-b-lg"
              : ""
          }`}
        >
          <Link to="success-stories" className="">
            Success stories
          </Link>
        </li>
        <li className="text-md font-medium px-2 py-1 transition-all hover:bg-red-400 hover:rounded-b-lg  duration-500">
          <button
            onClick={() => {
              setMsg("Sure to logout ?");
              setShowModal(true);
            }}
            className=""
          >
            Logout
          </button>
        </li>
      </ul>
      <span className="text-lg font-semibold w-44 text-right tracking-wider">
        🕥 {time.split(" ")[0]}
      </span>
      <Modal msg={msg} showModal={showModal} onAnswer={setAnswer} />
    </div>
  );
}

export default NavBar;
