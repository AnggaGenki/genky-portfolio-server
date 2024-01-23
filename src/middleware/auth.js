import prismaClient from "../application/database.js";
import env from "../env.js";
import jwt from "jsonwebtoken";

const fResponseError = (pReq, pRes, pErrorType) => {
  const cUnauthorizedCode = env.httpStatus.clientError.unauthorized.code;
  const cOriginalUrl = pReq.originalUrl;

  if (
    cOriginalUrl === "/api/users/register" ||
    cOriginalUrl === "/api/users/login"
  ) {
    if (pErrorType === "another error") {
      pRes.status(cUnauthorizedCode).json({
        error: {
          title: "Problematic Code",
          messages: [
            "Code have a problem cannot be used",
            "Please use another code by pressing the change button next to the code",
          ],
        },
      });
    } else if (pErrorType === "jwt expired") {
      pRes.status(cUnauthorizedCode).json({
        error: {
          title: "Expired Code",
          messages: [
            "Code is expired cannot be used",
            "Please use another code by pressing the change button next to the code",
          ],
        },
      });
    } else if (pErrorType === "unmatch code") {
      pRes.status(cUnauthorizedCode).json({
        error: {
          title: "Unmatch Code",
          messages: [
            "Code is unmatch cannot be used",
            "Please match the code above",
          ],
        },
      });
    }
  } else {
    if (pErrorType === "another error") {
      pRes.status(cUnauthorizedCode).json({
        error: {
          title: "Problematic Login Session",
          messages: [
            "Login session have a problem cannot continue the request",
            "Please log back in to continue the request",
          ],
        },
      });
    } else if (pErrorType === "jwt expired") {
      pRes.status(cUnauthorizedCode).json({
        error: {
          title: "Login Session Expired",
          messages: [
            "Login session has expired unable to continue request",
            "Please log back in to continue the request",
          ],
        },
      });
    }
  }
};

const AuthMiddleware = (pReq, pRes, pNext) => {
  const cToken = pReq.headers.authorization.split(" ");

  if (cToken[0] === process.env.TOKENKEY) {
    jwt.verify(cToken[1], process.env.JWTKEY, async (pErr, pData) => {
      if (pErr) {
        if (pErr.message === "jwt expired") {
          fResponseError(pReq, pRes, "jwt expired");
        } else {
          fResponseError(pReq, pRes, "another error");
        }
      } else {
        if (pData.captchaCode) {
          if (pData.captchaCode === pReq.headers["captcha-code"]) {
            pNext();
          } else {
            fResponseError(pReq, pRes, "unmatch code");
          }
        } else {
          const cQueryFindUser = await prismaClient.user.findUnique({
            where: {
              token: pData.loginToken,
            },
            select: {
              id: true,
              username: true,
              password: true,
            },
          });

          if (cQueryFindUser) {
            pReq.user = cQueryFindUser;
            pNext();
          } else {
            fResponseError(pReq, pRes, "another error");
          }
        }
      }
    });
  } else {
    fResponseError(pReq, pRes, "another error");
  }
};

export default AuthMiddleware;
