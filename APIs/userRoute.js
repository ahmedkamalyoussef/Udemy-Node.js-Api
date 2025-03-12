const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPassword,
} = require("../Services/userService");
const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
} = require("../Utils/validators/userValidations");

const router = express.Router();


router.put("/changePassword/:id",changeUserPasswordValidator, updateUserPassword);

router.route("/").post(createUserValidator, createUser).get(getUsers);

router
  .route("/:id")
  .get(getUserValidator, getUserById)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
