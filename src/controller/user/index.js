import env from "../../env.js";
import CaptchaCodeService from "../../service/user/captchaCode.js";

const CaptchaCode = (pReq, pRes, pNext) => {
  try {
    const cResult = CaptchaCodeService();

    pRes.status(env.httpStatus.success.OK.code).json({
      data: {
        captcha_code: cResult.captchaCode,
        token: cResult.token,
      },
    });
  } catch (pErr) {
    pNext(pErr);
  }
};

export default { CaptchaCode };
