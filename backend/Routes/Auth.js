const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../Controllers/AuthController");

// path0: Sign Up
router.post(
  "/v1/path0",
  [
    check("name").notEmpty().withMessage("Your Name can't be empty!"),
    check("email").isEmail().withMessage("Please entre valid Email"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password can't be less then 8 characters"),
  ],
  authController.register
);

//path1: Login
router.post(
  "/v1/path1",
  [
    check("email").isEmail().withMessage("Please entre valid Email"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("This is an incorrect password. Please try again."),
  ],
  authController.login
);

//path2: Re-check Auth [On relaod]
router.get(
  "/v1/path2",
  authController.clientVerifyToken,
  authController.recheckauth
);

//Path3: Send Reset Password Request
router.post(
  "/v1/path3",
  [check("email").isEmail().withMessage("Please entre valid Email")],
  authController.sendResetPasswordRequest
);

//Path4: Confirm Reset Password Request
router.post("/v1/path4", authController.confimrRestPassword);

//Path5: Reset Password (change password)
router.post(
  "/v1/path5",
  [
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password can't be less then 8 character"),
  ],
  authController.resetPassword
);
//Path5: Reset Password (change password)
router.post("/v1/path6", authController.accessAcount);

/* ############# Admin Routes ############### */
//Path10 Admin Login
router.post(
  "/v1/path10",
  [
    check("email").isEmail().withMessage("Please entre valid Email"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("This is an incorrect password. Please try again."),
  ],
  authController.adminLogin
);
//path11: Re-check Admin Auth [On relaod]
router.get(
  "/v1/path11",
  authController.adminVerifyToken,
  authController.Adminrecheckauth
);
// Export the routers
module.exports = router;
