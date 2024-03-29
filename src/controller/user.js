import env from "../env.js";
import CaptchaCodeService from "../service/user/captcha-code.js";
import UserUpdateService from "../service/user/update.js";
import UserLoginService from "../service/user/login.js";
import UserRegisterService from "../service/user/register.js";
import UserLogoutService from "../service/user/logout.js";
import UserDeleteService from "../service/user/delete.js";

const cOkCode = env.httpStatus.success.OK.code;
const cCreatedCode = env.httpStatus.success.created.code;

const CaptchaCode = (pReq, pRes, pNext) => {
  try {
    const cResult = CaptchaCodeService();

    pRes.status(cOkCode).json({
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

    pRes.status(cCreatedCode).json({
      data: cResult,
    });
  } catch (pErr) {
    pNext(pErr);
  }
};

const Login = async (pReq, pRes, pNext) => {
  try {
    const cResult = await UserLoginService(pReq.body);

    pRes.status(cOkCode).json({
      data: cResult,
    });
  } catch (pErr) {
    pNext(pErr);
  }
};

const Update = async (pReq, pRes, pNext) => {
  try {
    const cResult = await UserUpdateService(pReq.user, pReq.body);

    pRes.status(cOkCode).json({
      data: cResult,
    });
  } catch (pErr) {
    pNext(pErr);
  }
};

const Logout = async (pReq, pRes, pNext) => {
  try {
    await UserLogoutService(pReq.user);

    pRes.status(cOkCode).json({
      data: {
        status: "Logout Successful",
      },
    });
  } catch (pErr) {
    pNext(pErr);
  }
};

const Delete = async (pReq, pRes, pNext) => {
  try {
    await UserDeleteService(pReq.user);

    pRes.status(cOkCode).json({
      data: {
        status: "Delete Account Successfully",
      },
    });
  } catch (pErr) {
    pNext(pErr);
  }
};

export default { CaptchaCode, Register, Login, Update, Logout, Delete };
