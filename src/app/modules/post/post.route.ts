import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authUser } from "../../middlewares/authUser";
import {
  createPostValidationSchema,
  updatePostValidationSchema,
} from "./post.validation";
import { PostControllers } from "./post.controller";

const router = express.Router();

// create post
router.post(
  "/create-post",
  authUser,
  validateRequest(createPostValidationSchema),
  PostControllers.createPost
);

// get a post
router.get("/:postId", authUser, PostControllers.getSinglePost);

// get all posts
router.get("/", authUser, PostControllers.getAllPosts);

// get my posts
router.get("/my-posts", authUser, PostControllers.getMyPosts);

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
