const express = require("express");
const {
  register,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../Services/authService");
const {
  registerValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../Utils/validators/authValidations");

const router = express.Router();

// router.put(
//   "/changePassword/:id",
//   changeUserPasswordValidator,
//   updateUserPassword
// );

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPasswordValidator, resetPassword);

// router
//   .route("/:id")
//   .get(getUserValidator, getUserById)
//   .put(updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
