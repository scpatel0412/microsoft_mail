import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./containers/login/Login";
import Profile from "./containers/profile/Profile";
import Mail from "./containers/mails/Mail";
import SendEmails from "./containers/SendEmails.js/SendEmails";
import InfiniteScroll from "./InfiniteScroll";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mails" element={<Mail />} />
          <Route path="/send-emails" element={<SendEmails />} />
          <Route path="/scroll" element={<InfiniteScroll />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
