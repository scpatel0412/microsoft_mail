import React, { useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Link } from "react-router-dom";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";
import axios from "axios";
import "./sendemails.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var base64 = require("base-64");
var utf8 = require("utf8");

function SendEmails() {
  const accessToken = localStorage.getItem("token");
  const [emailInput, setEmailInput] = useState({
    to: "",
    contentType: "",
    content: "",
    subject: "",
  });
  const [error, setError] = useState("");
  async function HandleSumit(e) {
    e.preventDefault();
    console.log("hello", emailInput);
    if (
      emailInput.to === "" ||
      emailInput.contentType === "" ||
      emailInput.content === "" ||
      emailInput.subject === ""
    ) {
      alert("please enter all fields");
    } else {
      const message = {
        message: {
          subject: emailInput.subject,
          body: {
            contentType: emailInput.contentType,
            content: emailInput.content,
          },
          toRecipients: [
            {
              emailAddress: {
                address: emailInput.to,
              },
            },
          ],
        },
      };
      const jsonStringify = JSON.stringify(message);
      const encoded = base64.encode(utf8.encode(jsonStringify));
      const decoded = base64.decode(encoded);
      await axios
        .post("https://graph.microsoft.com/v1.0/me/sendMail", message, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // "Content-Type": "text/plain",
          },
        })
        .then((res) => {
          if (res) {
            toast.success("Email Sent Successfully !", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
        })
        .catch((e) => {
          console.log("error", e);
          toast.error("Something Went Wrong !", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
          });
          setError(e.message);
        });
    }
  }
  return (
    <div>
      <Header />
      <main>
        <UnauthenticatedTemplate>
          <div className="button_logo">
            <h1>
              You are not authorized to view this page <Link to="/">Login</Link>
            </h1>
          </div>
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <div className="sent-mail">
            <h3>Outlook email</h3>
            <p style={{ color: "red" }}>{error}</p>
            <form onSubmit={(e) => HandleSumit(e)}>
              <div className="mb-3">
                <label className="form-label">To</label>
                <input
                  type="email"
                  className="form-control"
                  value={emailInput.to}
                  onChange={(e) =>
                    setEmailInput({ ...emailInput, to: e.target.value })
                  }
                />
                <div className="form-text">Sender's email</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Content-type</label>
                <select
                  className="form-select"
                  value={emailInput.contentType}
                  onChange={(e) =>
                    setEmailInput({
                      ...emailInput,
                      contentType: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Select ContentType
                  </option>
                  <option value="Html">Html</option>
                  <option value="Text">Text</option>
                  {/* <option value="MIME">MIME</option> */}
                </select>
                <div className="form-text">Select ContentType</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  value={emailInput.subject}
                  onChange={(e) =>
                    setEmailInput({
                      ...emailInput,
                      subject: e.target.value,
                    })
                  }
                />
                <div className="form-text">Enter tour email subject here.</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea
                  className="form-control"
                  rows="10"
                  cols="20"
                  value={emailInput.content}
                  onChange={(e) =>
                    setEmailInput({
                      ...emailInput,
                      content: e.target.value,
                    })
                  }
                ></textarea>
                <div className="form-text">enter your email content.</div>
              </div>
              <button type="submit" className="btn btn-warning">
                Send
              </button>
            </form>
            <ToastContainer />
          </div>
        </AuthenticatedTemplate>
      </main>
      <Footer />
    </div>
  );
}

export default SendEmails;
