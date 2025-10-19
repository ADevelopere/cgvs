export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const validEmailCharRegex = /^[a-zA-Z0-9._@-]$/;

export const isValidEmailChar = (char: string) => {
  if (validEmailCharRegex.test(char)) {
    return true;
  } else {
    return false;
  }
};

const isValidEmail = (email: string) => {
  if (emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
};

export default isValidEmail;
