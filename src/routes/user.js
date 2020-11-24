const express = require("express");
const {
  validateInput,
  validateLoginInput,
} = require("../middlewares/validate");

const {
  loginUserCtrl,
  registerUserCtrl,
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
} = require("../controllers");
const { isAdmin, isOwnerOrAdmin } = require("../middlewares/verifyJwt");


const router = new express.Router();

router.route("/login").post(validateLoginInput, loginUserCtrl);
router
  .route("/")
  .get(isAdmin, getAllUsers)
  .post(validateInput, registerUserCtrl);
router
  .route("/:id")
  .get(isOwnerOrAdmin, getUser)
  .patch(validateLoginInput, isOwnerOrAdmin, editUser)
  .delete(isOwnerOrAdmin, deleteUser);

module.exports = router;
