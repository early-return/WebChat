export default {
  validateName(name) {
    console.log();
    if (/^[\u4e00-\u9fa5\w]+$/.test(name)) {
      return true;
    }
    return false;
  },
  validateEmail(email) {
    console.log('validate: ', email);
    if (/^\w+@\w+\.\w+$/.test(email)) {
      return true;
    }
    return false;
  },
};
