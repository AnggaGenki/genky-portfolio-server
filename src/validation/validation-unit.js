const regex = {
  username: "^[a-zA-Z0-9_ -]{3,100}$",
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

export default { regex, InvalidSeparator };
