import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import { authUser } from "../../middlewares/authUser";
import { createUserValidationSchema } from "../user/user.validation";
import { UserControllers } from "../user/user.controller";

const router = express.Router();

// create user
router.post(
  "/signup",
  validateRequest(createUserValidationSchema),
  UserControllers.signUp
);

// login route
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post(
  "/change-password",
  authUser,
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  "/forget-password",
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
