const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../Services/userService");
const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
} = require("../Utils/validators/userValidations");

const router = express.Router();

router.route("/").post(createUserValidator, createUser).get(getUsers);

router
  .route("/:id")
  .get(getUserValidator, getUserById)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
