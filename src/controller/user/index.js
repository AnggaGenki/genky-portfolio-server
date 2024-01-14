import env from "../../env.js";
import CaptchaCodeService from "../../service/user/captcha-code.js";
import UserRegisterService from "../../service/user/user-register.js";

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

const Register = async (pReq, pRes, pNext) => {
  try {
    const cResult = await UserRegisterService(pReq.body);

    pRes.status(env.httpStatus.success.created.code).json({
      data: cResult,
    });
  } catch (pErr) {
    pNext(pErr);
  }
};

export default { CaptchaCode, Register };
