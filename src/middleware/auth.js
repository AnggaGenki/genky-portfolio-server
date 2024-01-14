import env from "../env.js";
import jwt from "jsonwebtoken";

const AuthMiddleware = (pReq, pRes, pNext) => {
  const cToken = pReq.headers.authorization.split(" ");

  if (cToken[0] === "Bearer") {
    jwt.verify(cToken[1], process.env.JWTKEY, (pErr, pData) => {
      if (pErr) {
        if (pErr.message === "jwt expired") {
          pRes.status(env.httpStatus.clientError.unauthorized.code).json({
            error: {
              title: "Expired Code",
              messages: [
                "Code is expired cannot be used",
                "Please use another code by pressing the change button next to the code",
              ],
            },
          });
        } else {
          pRes.status(env.httpStatus.clientError.unauthorized.code).json({
            error: {
              title: "Problematic Code",
              messages: [
                pErr.message,
                "Code have a problem cannot be used",
                "Please use another code by pressing the change button next to the code",
              ],
            },
          });
        }
      } else {
        if (pData.captchaCode) {
          if (pData.captchaCode === pReq.headers["captcha-code"]) {
            pNext();
          } else {
            pRes.status(env.httpStatus.clientError.unauthorized.code).json({
              error: {
                title: "Unmatch Code",
                messages: [
                  "Code is unmatch cannot be used",
                  "Please match the code above",
                ],
              },
            });
          }
        }
      }
    });
  } else {
    pRes.status(env.httpStatus.clientError.unauthorized.code).json({
      error: {
        title: "Problematic Code",
        messages: [
          "Code have a problem cannot be used",
          "Please use another code by pressing the change button next to the code",
        ],
      },
    });
  }
};

export default AuthMiddleware;
