import prismaClient from "../../application/database.js";
import env from "../../env.js";
import ResponseError from "../../error/response.js";
import userValidation from "../../validation/user.js";
import Validate from "../../validation/validation.js";
import bcrypt from "bcrypt";

const UserUpdateService = async (pUser, pReqBody) => {
  const cReqBody = Validate(
    userValidation.update,
    pReqBody,
    "username.update|password.update"
  );

  const cDataUserUpdate = {};

  if (cReqBody.username) {
    cDataUserUpdate.username = cReqBody.username;
  }

  if (cReqBody.password) {
    const cIsPasswordValid = await bcrypt.compare(
      cReqBody.current_password,
      pUser.password
    );

    if (!cIsPasswordValid) {
      throw new ResponseError(
        env.httpStatus.clientError.unprocessableEntity.code,
        "Current Password Incorrect",
        [
          "Update Failed",
          "The current password is incorrect",
          "Please use the password you are using now (before the password was changed)",
        ]
      );
    }

    cDataUserUpdate.password = await bcrypt.hash(cReqBody.password, 10);
  }

  if (cDataUserUpdate.username || cDataUserUpdate.password) {
    return prismaClient.user.update({
      where: {
        id: pUser.id,
      },
      data: cDataUserUpdate,
      select: {
        username: true,
      },
    });
  } else {
    return {
      username: pUser.username,
    };
  }
};

export default UserUpdateService;
