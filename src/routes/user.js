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
const { verifyUser, verifyAdmin } = require("../middlewares/verifyJwt");
const router = new express.Router();

router.route("/login").post(validateLoginInput, loginUserCtrl);
router
  .route("/")
  .get(verifyUser, verifyAdmin, getAllUsers)
  .post(validateInput, registerUserCtrl);
router
  .route("/:id")
  .get(verifyUser, getUser)
  .patch(validateLoginInput, editUser)
  .delete(verifyUser, deleteUser);

module.exports = router;
