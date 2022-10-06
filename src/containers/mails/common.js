import * as pkijs from "pkijs";
import * as pvtsutils from "pvtsutils";

function decodePEM(pem, tag = "[A-Z0-9 ]+") {
  const pattern = new RegExp(
    `-{5}BEGIN ${tag}-{5}([a-zA-Z0-9=+\\/\\n\\r]+)-{5}END ${tag}-{5}`,
    "g"
  );
  const res = [];
  let matches = null;
  // eslint-disable-next-line no-cond-assign
  while ((matches = pattern.exec(pem))) {
    const base64 = matches[1].replace(/\r/g, "").replace(/\n/g, "");
    res.push(pvtsutils.Convert.FromBase64(base64));
  }
  return res;
}

export function parseCertificate(source) {
  const buffers = [];

  const buffer = pvtsutils.BufferSourceConverter.toArrayBuffer(source);
  const pem = pvtsutils.Convert.ToBinary(buffer);
  if (/----BEGIN CERTIFICATE-----/.test(pem)) {
    buffers.push(...decodePEM(pem, "CERTIFICATE"));
  } else {
    buffers.push(buffer);
  }
  const res = [];
  for (const item of buffers) {
    res.push(pkijs.Certificate.fromBER(item));
  }
  return res;
}
