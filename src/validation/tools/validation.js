import env from "../../env.js";
import ResponseError from "../../error/response.js";
import validationFailedMessage from "./validation-failed-message.js";

const fChangeValidation = (pValidation, pChangeValidation) => {
  let vValidationMethod = "default";

  if (pChangeValidation) {
    if (pChangeValidation.includes(pValidation)) {
      const cSplitChangeValidation = pChangeValidation.split("|");
      const cValidationIndex = cSplitChangeValidation.findIndex((pItem) =>
        pItem.startsWith(pValidation)
      );
      const cSplitValidation =
        cSplitChangeValidation[cValidationIndex].split(".");

      vValidationMethod = cSplitValidation[1];
    }
  }

  switch (vValidationMethod) {
    case "default":
      return validationFailedMessage[pValidation].default;
    case "update":
      return validationFailedMessage[pValidation].update;
  }
};

const Validate = (pSchema, pRequest, pChangeValidation = "") => {
  const cResult = pSchema.validate(pRequest);

  if (cResult.error) {
    const cLabel = cResult.error.details[0].context.label;
    const cBadRequestCode = env.httpStatus.clientError.badRequest.code;

    switch (cLabel) {
      case "username":
        throw new ResponseError(
          cBadRequestCode,
          "Username Validation Failed",
          fChangeValidation("username", pChangeValidation)
        );
      case "password":
        throw new ResponseError(
          cBadRequestCode,
          "Password Validation Failed",
          fChangeValidation("password", pChangeValidation)
        );
      case "password_confirm":
        throw new ResponseError(
          cBadRequestCode,
          "Password Confirmation Validation Failed",
          fChangeValidation("passwordConfirm", pChangeValidation)
        );
      case "current_password":
        throw new ResponseError(
          cBadRequestCode,
          "Current Password Validation Failed",
          fChangeValidation("currentPassword", pChangeValidation)
        );
    }
  } else {
    return cResult.value;
  }
};

export default Validate;
