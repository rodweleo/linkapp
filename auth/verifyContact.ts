const userList = require("../data/users");

const verifyContact = function (contact: number) {
  userList.map((user) => {
    if (user.contact === contact) {
      return true;
    }
  });

  return false;
};

module.exports = verifyContact;
