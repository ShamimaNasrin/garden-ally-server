import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authAdmin, authUser } from "../../middlewares/authUser";
import { updateUserValidationSchema } from "./user.validation";

const router = express.Router();

// get all user
router.get("/", authUser, authAdmin, UserControllers.getAllUsers);

// get a single user
router.get("/:userId", authUser, UserControllers.getSingleUser);

// update user profile data
router.patch(
  "/updateProfile",
  authUser,
  authAdmin,
  validateRequest(updateUserValidationSchema),
  UserControllers.updateUserRole
);

// add post to favorites
router.post("/add-favorite/:id", authUser, UserControllers.addFavoritePost);

// gett all favorites
router.get("/favorites/:id", authUser, UserControllers.getAllFavoritePosts);

// remove post from favorites
router.delete(
  "/remove-favorite/:id",
  authUser,
  UserControllers.removeFavoritePost
);

// add follow
router.post("/add-follow/:id", authUser, UserControllers.addFollow);

// remove from follow
router.delete("/unfollow/:id", authUser, UserControllers.unFollow);

export const UserRoutes = router;
