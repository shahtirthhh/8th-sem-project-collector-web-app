import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Context } from "../store/context-values";
import Header from "../components/homepage/Header";
import NavBar from "../components/dashboard/NavBar";

function Dashboard() {
  const navigate = useNavigate();
  const token = useContext(Context).token;
  //   if (!token) {
  //     navigate("/");
  //   }
  return (
    <div className="flex flex-col items-center bg-teal-300">
      <Header />
      <NavBar />
      <Outlet />
    </div>
  );
}

export default Dashboard;
