import env from "../env.js";
import ResponseError from "../error/response.js";
import validationUnit from "./validation-unit.js";

const Validate = (pSchema, pRequest) => {
  const cResult = pSchema.validate(pRequest);

  if (cResult.error) {
    const cLabel = cResult.error.details[0].context.label;
    const cBadRequestCode = env.httpStatus.clientError.badRequest.code;
    const cValidationFailMessages = validationUnit.failedMessages;

    switch (cLabel) {
      case "username":
        throw new ResponseError(
          cBadRequestCode,
          "Username Validation Failed",
          cValidationFailMessages.username
        );
      case "password":
        throw new ResponseError(
          cBadRequestCode,
          "Password Validation Failed",
          cValidationFailMessages.password
        );
      case "password_confirm":
        throw new ResponseError(
          cBadRequestCode,
          "Password Confirmation Validation Failed",
          cValidationFailMessages.passwordConfirm
        );
    }
  } else {
    return cResult.value;
  }
};

export default Validate;
