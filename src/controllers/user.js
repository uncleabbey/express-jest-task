const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const db = require("../db/client");
const {
  addUserQuery,
  findUserQuery,
  getAllUserQuery,
  findUserByIdQuery,
  updateUserQuery,
  deleteUserQuery,
} = require("../db/query");
const hashString = require("../helper/hashString");

const registerUserCtrl = async (req, res, next) => {
  const { username, password, isAdmin } = req.body;
  if(!username || username.length <= 3 || !password || username.length <= 6 || !isAdmin){
     return next({
      status: 400,
      error: "All fields are required",
    });
     }
  try {
    const findUser = await db.query(findUserQuery, [username]);
    if (findUser.rows.length === 0) {
      const result = await db.query(addUserQuery, [
        username,
        hashString(password),
        isAdmin,
      ]);
      const user = result.rows[0];
      const token = sign(
        { id: user.id, isAdmin: user.isadmin },
        process.env.SEC_KEY,
        { expiresIn: "24h" }
      );

      return res.status(201).json({
        message: "User added successfully",
        user,
        token,
      });
    }
    return next({
      status: 400,
      error: "User already exist",
    });
  } catch (error) {
    return next({
      status: 500,
      error,
    });
  }
};

const loginUserCtrl = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await db.query(findUserQuery, [username]);
    if (result.rows.length === 1) {
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return next({
          status: 400,
          error: "Invalid Username or Password",
        });
      }
      const token = sign(
        { id: user.id, isAdmin: user.isadmin },
        process.env.SEC_KEY,
        { expiresIn: "24h" }
      );
      return res.status(201).json({
        message: "Login is successful",
        token,
      });
    }
    return next({
      status: 400,
      error: "Invalid Username or Password",
    });
  } catch (error) {
    return next({
      status: 500,
      error,
    });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query(getAllUserQuery);
    return res.status(200).json({
      users: result.rows,
    });
  } catch (error) {
    return next({
      status: 500,
      error,
    });
  }
};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(findUserByIdQuery, [id]);
    if (result.rows.length === 1) {
      return res.status(200).json({
        user: result.rows[0],
      });
    }
    return next({
      status: 404,
      error: "User not found",
    });
  } catch (error) {
    return next({
      status: 500,
      error,
    });
  }
};

const editUser = async (req, res, next) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    const findUser = await db.query(findUserByIdQuery, [id]);
    if (findUser.rows.length === 0) {
      return next({
        status: 404,
        error: "User not found",
      });
    }
    const result = await db.query(updateUserQuery, [username, password, id]);
    return res.status(200).json({
      message: "user updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    return next({
      status: 500,
      error,
    });
  }
};
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const findUser = await db.query(findUserByIdQuery, [id]);
    if (findUser.rows.length === 0) {
      return next({
        status: 404,
        error: "User not found",
      });
    }
    const result = await db.query(deleteUserQuery, [id]);
    return res.status(200).json({
      message: "user deleted successfully",
    });
  } catch (error) {
    return next({
      status: 500,
      error,
    });
  }
};
module.exports = {
  registerUserCtrl,
  loginUserCtrl,
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
};
