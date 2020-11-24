const express = require("express");
const userRoutes = require("./user");

const router = new express.Router();

router.use("/users", userRoutes)

module.exports = router;