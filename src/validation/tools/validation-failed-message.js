export default {
  username: {
    default: [
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
      "There must be no separators before or after the username",
      "There must be no double separators",
    ],
    update: [
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
      "There must be no separators before or after the username",
      "There must be no double separators",
    ],
  },
  password: {
    default: [
      "Password is required",
      "Minimum character length is 5",
      "Maximum character length is 100",
    ],
    update: [
      "Minimum character length is 5",
      "Maximum character length is 100",
    ],
  },
  passwordConfirm: {
    default: ["The confirmation password must be the same as the password"],
  },
  currentPassword: {
    default: ["Current password is required"],
  },
};
