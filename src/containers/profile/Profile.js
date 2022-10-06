import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";
import React from "react";
import Footer from "../../component/footer/Footer";
import Header from "../../component/header/Header";
import { Link } from "react-router-dom";
import "./profile.scss";
var base64 = require("base-64");
var utf8 = require("utf8");

function Profile() {
  const userData = JSON.parse(localStorage.getItem("userData"));

  // function selectFile(e) {
  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const text = base64.encode(utf8.encode(e.target.result));
  //     console.log(text);
  //     alert(text);
  //   };
  //   reader.readAsText(e.target.files[0]);
  // }
  return (
    <div>
      <Header />
      <main className="button_logo">
        <UnauthenticatedTemplate>
          <h1>
            You are not authorized to view this page <Link to="/">Login</Link>
          </h1>
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <ul>
            <li>
              Welcome <b>{userData?.name}</b>
            </li>
            <li>
              Your Tenant is <b>{userData?.tenantId}</b>
            </li>
            <li>
              Your preferred email or username{" "}
              <b>{userData?.idTokenClaims.preferred_username}</b>
            </li>
          </ul>
          {/* <input type="file" onChange={(e) => selectFile(e)} /> */}
        </AuthenticatedTemplate>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
