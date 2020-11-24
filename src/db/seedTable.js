const { v4: uuid } = require("uuid");
const db = require("./client");
const { addUserQuery } = require("./query");
const hashString = require("../helper/hashString");

const testUsers = [
  {
    username: "wizkidayo",
    password: "12345678",
    isAdmin: false,
  },
  {
    username: "davido",
    password: "12345678",
    isAdmin: true,
  },
  {
    username: "burnaboy",
    password: "12345678",
    isAdmin: false,
  },
];

const addUser = async (username, password, isAdmin) => {
  try {
    const result = await db.query(addUserQuery, [username, password, isAdmin]);
    console.log("User created Successfully");
    return result.rows[0].id;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const seedTable = async () => {
  try {
    await Promise.all(
      testUsers.map(({ username, password, isAdmin }) =>
        addUser(username, hashString(password), isAdmin)
      )
    );
  } catch (error) {
    console.log(error);
  }
};

seedTable().then(process.exit);
