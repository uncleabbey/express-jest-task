const bcrypt = require("bcrypt");


const hashString = password => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

module.exports = hashString;