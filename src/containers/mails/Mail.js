import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Link } from "react-router-dom";
import * as common from "./common";
import parse from "emailjs-mime-parser";
import * as pvutils from "pvutils";
import * as pkijs from "pkijs";
import * as pvtsutils from "pvtsutils";

function Mail() {
  const [mailData, setMailData] = useState({});
  const [error, setError] = useState("");
  const [smimeHeader, setSmimeHeader] = useState("");
  const [smimeHeader1, setSmimeHeader1] = useState("");
  const [emailId, setEmailId] = useState("");
  const [certFile, setCertFile] = useState([]);
  const accessToken = localStorage.getItem("token");
  const trustedCertificates = [];
  useEffect(() => {
    axios
      .get("https://graph.microsoft.com/v1.0/me/messages/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res) {
          setMailData(res.data);
        }
      })
      .catch((e) => {
        console.log("error", e.message);
        setError(e.message);
      });
  }, []);

  async function GetHeaders(id) {
    console.log("id", id);
    await axios
      .get(`https://graph.microsoft.com/v1.0/me/messages/${id}/$value`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        if (res) {
          // alert(res.data);
          setSmimeHeader(res.data);
          setEmailId(id);
          // var stringVerify = "Content-Type: application/pkcs7-signature;";
          // const hello = res.data.includes(stringVerify);
          // alert(hello ? "Smime verified" : "Smime not verified");
        }
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  async function handleCAfile(e) {
    // common.handleFile;
    console.log("e.target.files[0]", e.target.files[0]);
    const currentFiles = e.target.files[0];
    const tempReader = new FileReader();
    tempReader.onload = (event) => {
      const file = event.target.result;
      console.log("file", file);
      trustedCertificates.push(...common.parseCertificate(event.target.result));
      console.log("//", trustedCertificates);
      setCertFile(trustedCertificates);

      if (!(file instanceof ArrayBuffer)) {
        throw new Error("incorrect type of the file. Must be ArrayBuffer");
      }
    };

    tempReader.readAsArrayBuffer(currentFiles);
    console.log();
    console.log("certFile", certFile);
    trustedCertificates.push(...common.parseCertificate(certFile));
    console.log("trustedCertificates", trustedCertificates);
  }

  async function VerifySmime(smimeheader) {
    console.log("trustedCertificates", certFile);
    const parser = parse(smimeheader);
    console.log("parser", parser);
    if ("childNodes" in parser || parser.childNodes.length !== 2) {
      const lastNode = parser.childNodes[1];
      console.log("lastnode", lastNode);
      if (
        lastNode.contentType.value === "application/x-pkcs7-signature" ||
        lastNode.contentType.value === "application/pkcs7-signature"
      ) {
        let cmsContentSimpl;
        let cmsSignedSimpl;
        let signers;
        try {
          cmsContentSimpl = pkijs.ContentInfo.fromBER(lastNode.content.buffer);
          cmsSignedSimpl = new pkijs.SignedData({
            schema: cmsContentSimpl.content,
          });
          signers = new pkijs.SignedData({
            schema: cmsContentSimpl.content,
          }).signerInfos;
          var string = new TextDecoder().decode(parser.childNodes[1].content);
          var string2 = new TextDecoder().decode(
            cmsSignedSimpl.certificates[1].tbsView.buffer
          );
          var string3 = string2.replace(
            /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
            ""
          );
          var string1 = string
            .replace(
              /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
              ""
            )
            .replace(/[&\\\#,+()$~%'"*?<>{}0-9|^=`!;]/g, "");
          setSmimeHeader1(string1);
          console.log(
            "cmsContentSimpl cmsSignedSimpl",
            cmsContentSimpl,
            cmsSignedSimpl,
            string3,
            // string4,
            // string3
            signers
          );
        } catch (ex) {
          alert(`Incorrect message format!${ex.message}`);
          return;
        }
        const signedDataBuffer = pvutils.stringToArrayBuffer(
          parser.childNodes[0].raw.replace(/\n/g, "\r\n")
        );
        if (certFile.length > 0) {
          try {
            const result = await cmsSignedSimpl.verify({
              signer: 0,
              data: signedDataBuffer,
              trustedCerts: certFile,
            });
            console.log("result", result);
            alert(
              `S/MIME message ${
                !result ? "verification failed" : "successfully verified"
              }!`
            );
          } catch (e) {
            alert(e.message);
          }
        } else {
          alert("certificate not uploaded");
        }
      } else {
        alert("this email doesnt contain application/x-pkcs7-signature");
      }
    } else {
      alert("not an smime message");
    }
  }

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
          <p style={{ color: "red" }}>{error}</p>
          <div>
            {mailData?.value?.map((i) => {
              return (
                <div style={{ border: "1px solid" }}>
                  <p>{i?.body.contentType}</p>
                  <div dangerouslySetInnerHTML={{ __html: i.body.content }} />
                  <button
                    className="btn btn-primary"
                    onClick={() => GetHeaders(i.id)}
                  >
                    Get Smime headers
                  </button>
                  <div>
                    {smimeHeader !== "" && emailId === i.id ? (
                      <div>
                        <input type="file" onChange={(e) => handleCAfile(e)} />
                        <textarea
                          value={smimeHeader}
                          rows="30"
                          cols="30"
                          onChange={(e) => console.log(e)}
                        ></textarea>
                        <button onClick={() => VerifySmime(smimeHeader)}>
                          verify smime
                        </button>
                        {smimeHeader1}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </AuthenticatedTemplate>
      </main>
      <Footer />
    </div>
  );
}

export default Mail;
