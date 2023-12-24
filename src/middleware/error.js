import env from "../env.js";
import ResponseError from "../error/response.js";

const ErrorMiddleware = (pErr, pReq, pRes, pNext) => {
  if (pErr) {
    if (pErr instanceof ResponseError) {
      pRes.status(pErr.status).json({
        error: {
          title: pErr.title,
          messages: pErr.messages,
        },
      });
    } else {
      pRes.status(env.httpStatus.serverError.internalServerError.code).json({
        error: {
          title: "Server Error",
          messages: [pErr.message],
        },
      });
    }
  } else {
    pNext();
  }
};

export default ErrorMiddleware;
