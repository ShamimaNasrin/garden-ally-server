import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authAdmin, authUser } from "../../middlewares/authUser";
import {
  createPostValidationSchema,
  updatePostValidationSchema,
} from "./post.validation";
import { PostControllers } from "./post.controller";

const router = express.Router();

// post activity chart data (admin)
router.get(
  "/post-activity",
  authUser,
  authAdmin,
  PostControllers.monthlyPostChart
);

// create post
router.post(
  "/create-post",
  authUser,
  validateRequest(createPostValidationSchema),
  PostControllers.createPost
);

// Image gallery
router.get("/post-images", PostControllers.getPostImages);

// get all posts
router.get("/", authUser, PostControllers.getAllPosts);

// get a post
router.get("/:postId", authUser, PostControllers.getSinglePost);

// get my posts
router.get("/my-posts/:userId", authUser, PostControllers.getMyPosts);

// delete a post
router.delete("/:postId", authUser, PostControllers.deleteAPost);

// update a post
router.patch(
  "/:postId",
  authUser,
  validateRequest(updatePostValidationSchema),
  PostControllers.updateAPost
);

// add a comment
router.post("/add-comment/:postId", authUser, PostControllers.addAComment);

// update a comment
router.patch(
  "/:postId/comment/:commentId",
  authUser,
  PostControllers.updateAComment
);

// delete a comment
router.delete(
  "/:postId/comment/:commentId",
  authUser,
  PostControllers.deleteAComment
);

// handle upvote and downvote
router.post("/vote/:postId", authUser, PostControllers.upVoteDownVote);

export const PostRoutes = router;
