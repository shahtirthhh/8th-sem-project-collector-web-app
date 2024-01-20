exports.isEmail = (email) => {
  if (typeof email !== "string") {
    return false;
  } else if (
    email.trim().length <= 4 ||
    !email.includes("@") ||
    !email.includes(".")
  ) {
    return false;
  } else {
    return true;
  }
};
exports.isPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;
