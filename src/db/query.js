const addUserQuery = `
    INSERT INTO users (username, password, isAdmin)
    VALUES ($1, $2, $3)
    RETURNING id, username, isAdmin
  `;

const findUserQuery = `
  SELECT * FROM users
  WHERE username = $1
`;

const getAllUserQuery = `
  SELECT id, username, isAdmin FROM users
`;
const findUserByIdQuery = `
  SELECT id, username, isAdmin FROM users
  WHERE id = $1
`;

const updateUserQuery = `
  UPDATE users SET username=$1, password=$2
  WHERE id=$3
  RETURNING id, username, isAdmin
`;
const deleteUserQuery = `
  DELETE FROM users WHERE id=$1
`;
module.exports = {
  addUserQuery,
  findUserQuery,
  getAllUserQuery,
  findUserByIdQuery,
  updateUserQuery,
  deleteUserQuery,
};
