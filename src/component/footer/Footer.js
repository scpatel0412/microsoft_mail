import React from "react";

function Footer() {
  var latestDate = new Date().getFullYear();
  return (
    <div>
      <footer className="bg-light text-center text-lg-start">
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          &copy; {latestDate} Copyright:
          <a className="text-dark" href="https://iflair.com/">
            iFlair technologies
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
// https://stackoverflow.com/questions/13512026/how-to-check-if-encrypted-s-mime-message-is-also-signed-without-decrypting-it
