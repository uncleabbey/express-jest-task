const { verify } = require("jsonwebtoken");
const db = require("../db/client");
const { findUserByIdQuery } = require("../db/query");

const stripBearerToken = (token) => {
  let stripedToken = token;
  if (token && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    const [, jwtToken] = token.split(" ");
    stripedToken = jwtToken;
  }
  return stripedToken;
};

const isOwnerOrAdmin = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return next({
      status: 401,
      error: "Access Denied: No token provided...",
    });
  }
  try {
    const strippedToken = stripBearerToken(token);
    const decoded = verify(strippedToken, process.env.SEC_KEY);
    const result = await db.query(findUserByIdQuery, [decoded.id]);
    if (result.rows.length === 1) {
      const user = result.rows[0];
      const { id } = req.params;
      if (user.isadmin) {
        req.user = user;
        return next();
      }
      if (user.id === Number(id)) {
        req.user = decoded;
        return next();
      }
      return next({
            status: 401,
            error: "sorry Only owner or admin can perform this operation",
          });
    }
    return next({
      status: 404,
      error: "User not found",
    });
  } catch (ex) {
    return next({
      status: 400,
      error: "Invalid token....",
    });
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return next({
      status: 401,
      error: "Access Denied: No token provided...",
    });
  }
    try {
          const strippedToken = stripBearerToken(token);
    const decoded = verify(strippedToken, process.env.SEC_KEY);
    const result = await db.query(findUserByIdQuery, [decoded.id]);
    if (result.rows.length === 1) {
      const user = result.rows[0];
      if (user.isadmin) {
        req.user = decoded;
        return next();
      }
      return res.status(401).json({
      status: "error",
      error: "Sorry Only Admin can perform this action",
      });
    }
    return next({
      status: 404,
      error: "User not found",
    });
    } catch (error) {
      return next({
      status: 400,
      error: "Invalid token....",
    });
    }
};

module.exports = { isOwnerOrAdmin, isAdmin };
