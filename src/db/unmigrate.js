const client = require("./client");

const dropTable = async () => {
  try {
    const result = await client.query("DROP TABLE IF EXISTS users CASCADE");
    console.log("Table Dropped successfully");
  } catch (error) {
    console.log(error);
  }
};

dropTable().then(process.exit);
