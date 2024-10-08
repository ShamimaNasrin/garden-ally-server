import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidationSchema } from "./user.validation";
import { authAdmin, authUser } from "../../middlewares/authUser";

const router = express.Router();

// create user
router.post(
  "/signup",
  validateRequest(userValidationSchema),
  UserControllers.signUp
);

// get all user
router.get("/", authUser, authAdmin, UserControllers.getAllUsers);

// update user
router.patch(
  "/:userId",
  authUser,
  authAdmin,

  UserControllers.updateUserRole
);

export const UserRoutes = router;
