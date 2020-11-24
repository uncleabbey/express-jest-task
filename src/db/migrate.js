const db = require("./client");

const createUserTable = async () => {
  const query = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(250) NOT NULL,
      isAdmin BOOLEAN DEFAULT 'f'
    )
  `;

  try {
    const res = await db.query(query);
    console.log("user table created succesfully");
  } catch (error) {
    console.log(error);
  }
};

createUserTable().then(process.exit);
