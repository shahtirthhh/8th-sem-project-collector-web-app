import React, { useContext, useReducer } from "react";
import { isEmail, isPassword } from "../../helpers/validators";
import axios from "axios";
import { Context } from "../../store/context-values";
import { useNavigate } from "react-router-dom";

const formReducer = (state, action) => {
  switch (action.type) {
    case "setEmail":
      return { ...state, email: action.email };
    case "setEmailVal":
      if (isEmail(state.email)) {
        return { ...state, emailVal: true };
      } else {
        return { ...state, emailVal: false };
      }
    case "setPassword":
      return { ...state, password: action.password };
    case "setPasswordVal":
      if (isPassword.test(state.password)) {
        return { ...state, passwordVal: true };
      } else {
        return { ...state, passwordVal: false };
      }
    case "setFormVal":
      if (state.emailVal && state.passwordVal) {
        return { ...state, formVal: true };
      } else {
        return { ...state, formVal: false };
      }
    default:
      break;
  }
};

function RightContainer() {
  // const token_context = useContext(Context).token;
  const navigate = useNavigate();
  const setToken_context = useContext(Context).setToken;

  const setNotification_context = useContext(Context).setNotification;
  const [loginForm, loginFormDispatch] = useReducer(formReducer, {
    email: "",
    emailVal: null,
    password: "",
    passwordVal: null,
    formVal: null,
  });
  const loginHandler = async (event) => {
    event.preventDefault();
    if (loginForm.emailVal && loginForm.passwordVal) {
      setNotification_context({ color: "blue", data: "Logging you in..." });
      const queryData = {
        query: `{
          login(email:"${loginForm.email}",password:"${loginForm.password}"){
            valid
            token
          }
        }`,
      };
      const response = await axios.post(process.env.REACT_APP_API, queryData);
      const data = response.data.data;
      if (data.login.valid) {
        console.log(data.login.token);
        setToken_context(data.login.token);
        setNotification_context({ color: "green", data: "Logged in !" });
        navigate("/dashboard");
      } else {
        setNotification_context({ color: "red", data: "Invalid details !" });
      }
    }
  };
  return (
    <div className="bg-gradient-to-r from-lime-300 h-fit absolute right-20 top-60 to-emerald-300 w-80 flex flex-col border-2 border-black rounded-xl">
      <form
        onSubmit={loginHandler}
        className="m-6  rounded-xl flex flex-col gap-1 p-4 items-center"
      >
        <h2 className="text-center mt-2 mb-4 text-3xl font-bold tracking-wider">
          LOGIN
        </h2>
        <div className="border border-black p-2 flex flex-col ">
          {!loginForm.emailVal && (
            <p className="text-xs font-semibold p-1 ">Email invalid</p>
          )}
          <input
            placeholder="Email"
            className="rounded-md p-1 text-base w-44"
            type="email"
            name="email"
            id="email"
            onChange={(event) => {
              loginFormDispatch({
                type: "setEmail",
                email: event.target.value,
              });
              loginFormDispatch({
                type: "setEmailVal",
              });
              loginFormDispatch({
                type: "setFormVal",
              });
            }}
          />
        </div>
        <div className="border border-black p-2 flex flex-col ">
          {!loginForm.passwordVal && (
            <p className=" text-xs font-semibold p-1 ">password invalid</p>
          )}
          <input
            onChange={(event) => {
              loginFormDispatch({
                type: "setPassword",
                password: event.target.value,
              });
              loginFormDispatch({
                type: "setPasswordVal",
              });
              loginFormDispatch({
                type: "setFormVal",
              });
            }}
            placeholder="password"
            className="rounded-md p-1 text-base w-44"
            type="password"
            name="password"
            id="password"
          />
        </div>
        {loginForm.formVal ? (
          <button className="rounded-md bg-white text-xs w-14" type="submit">
            SUBMIT
          </button>
        ) : (
          <span className="text-xs">Please enter all Details</span>
        )}
      </form>
    </div>
  );
}

export default RightContainer;
