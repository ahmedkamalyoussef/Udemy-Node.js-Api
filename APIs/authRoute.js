const express = require("express");
const { register,login } = require("../Services/authService");
const {
  registerValidator,
  loginValidator,
} = require("../Utils/validators/authValidations");

const router = express.Router();

// router.put(
//   "/changePassword/:id",
//   changeUserPasswordValidator,
//   updateUserPassword
// );

router.route("/register").post(registerValidator, register);
router.route("/login").post(loginValidator, login);

// router
//   .route("/:id")
//   .get(getUserValidator, getUserById)
//   .put(updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
