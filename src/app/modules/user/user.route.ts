import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authAdmin, authUser } from "../../middlewares/authUser";
import { updateUserValidationSchema } from "./user.validation";

const router = express.Router();

// get all user (admin)
router.get(
  "/getAllUsers/:adminId",
  authUser,
  authAdmin,
  UserControllers.getAllUsers
);

// update user role (admin)
router.patch("/:userId", authUser, authAdmin, UserControllers.updateUserRole);

// get all user for following suggestion
router.get(
  "/followSuggestion/:userId",
  authUser,
  UserControllers.fetchUnfollowedUsers
);

// get a single user
router.get("/:userId", authUser, UserControllers.getUserByID);
// router.get("/:userId", UserControllers.getUserByID);

// get a single user
router.get(
  "/getUserByEmail/:userEmail",
  authUser,
  UserControllers.getUserByEmail
);

// update user profile data
router.patch(
  "/updateProfile/:userId",
  authUser,
  validateRequest(updateUserValidationSchema),
  UserControllers.updateUserProfile
);

// add follow
router.post("/add-follow/:userId", authUser, UserControllers.addFollow);
// router.post("/add-follow/:userId", UserControllers.addFollow);

// remove from follow
router.delete("/unfollow/:userId", authUser, UserControllers.unFollow);
// router.delete("/unfollow/:userId", UserControllers.unFollow);

// add post to favorites
router.post("/add-favorite/:userId", authUser, UserControllers.addFavoritePost);

// get all favorites
router.get("/favorites/:userId", authUser, UserControllers.getAllFavoritePosts);

// remove post from favorites
router.delete(
  "/remove-favorite/:userId",
  authUser,
  UserControllers.removeFavoritePost
);

router.post("/get-premium/:userId", authUser, UserControllers.paymentToPremium);
// router.post("/get-premium/:userId", UserControllers.paymentToPremium);

export const UserRoutes = router;
