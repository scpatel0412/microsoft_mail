import React, { useState } from "react";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "../../Config";
import microsoftlogo from "../../assets/microsoft_logo.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({});
  const { instance } = useMsal();

  const history = useNavigate();

  async function handleLogin(instance) {
    console.log("instance", instance);
    await instance
      .loginPopup(loginRequest)
      .then((res) => {
        if (res) {
          setLoginData(res);
          // setAccessToken(res.accessToken);
          localStorage.setItem("token", res.accessToken);
          localStorage.setItem("userData", JSON.stringify(res.account));
          history("/profile");
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error("There is problem with your login !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setError("There is problem with your login");
      });
  }
  const userData = JSON.parse(localStorage.getItem("userData"));
  return (
    <div>
      <Header />
      <main className="button_logo">
        <UnauthenticatedTemplate>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => handleLogin(instance)}
          >
            <img src={microsoftlogo} className="me-2" />
            <span className=" d-inline-block">Login with Microsoft</span>
            <ToastContainer />
          </button>
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <ul>
            <li>
              Welcome <b>{loginData?.account?.name || userData?.name}</b>{" "}
            </li>
            <li>
              Your tenant id:{" "}
              <b>{loginData?.account?.tenantId || userData?.tenantId}</b>{" "}
            </li>
          </ul>
        </AuthenticatedTemplate>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
