const regex = {
  username: "^[a-zA-Z0-9_ -]{3,100}$",
};

const failedMessages = {
  username: [
    "Username is required",
    "Minimum character length is 3",
    "Maximum character length is 100",
    "Username can only consist of characters :",
    [
      "Lowercases (a-z)",
      "Uppercases (A-Z)",
      "Numbers (0-9)",
      "Separators :",
      ["Underscore (_)", "Dash (-)", "Space ( )"],
    ],
    "There must be no separators before or after the Username",
    "There must be no double separators",
  ],
  password: [
    "Password is required",
    "Minimum character length is 5",
    "Maximum character length is 100",
  ],
  passwordConfirm: [
    "The confirmation password must be the same as the password",
  ],
};

const InvalidSeparator = (pValue, pHelper) => {
  const fSeparatorUnit = (pValue, pSeparator) => {
    if (
      pValue.includes(pSeparator + pSeparator) ||
      pValue.indexOf(pSeparator) === 0 ||
      pValue.indexOf(pSeparator) === pValue.length - 1
    ) {
      return true;
    }

    return false;
  };

  if (
    fSeparatorUnit(pValue, " ") ||
    fSeparatorUnit(pValue, "_") ||
    fSeparatorUnit(pValue, "-")
  ) {
    return pHelper.message("The value contains invalid separators");
  }

  return pValue;
};

export default { regex, failedMessages, InvalidSeparator };
