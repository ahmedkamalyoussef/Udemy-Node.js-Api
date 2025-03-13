const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPassword,
  getLoggedUserData,
  changePassword,
} = require("../Services/userService");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
  changePasswordValidator,
} = require("../Utils/validators/userValidations");

const authService = require("../Services/authService");

const router = express.Router();

// 🔹 Routes for logged-in users
router.use(authService.protect);

router.get("/userData", getLoggedUserData, getUserById);
router.put("/changePassword",changePasswordValidator, changePassword);

// 🔹 Admin-protected routes
router.use(authService.allowedTo("admin"));

router.put(
  "/updateUserPassword/:id",
  changeUserPasswordValidator,
  updateUserPassword
);

router.route("/").post(createUserValidator, createUser).get(getUsers);

router
  .route("/:id")
  .get(getUserValidator, getUserById)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
