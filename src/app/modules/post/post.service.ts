/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PostModel } from "../post/post.model";
import { TComment, TPost } from "./post.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { User } from "../user/user.model";
import { Types } from "mongoose";

// create post function
const createPost = async (postData: Partial<TPost>): Promise<TPost> => {
  const result = await PostModel.create(postData);
  return result;
};

// get a single Post
const getSinglePost = async (postId: string): Promise<TPost | null> => {
  if (!postId) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid post ID");
  }

  // const result = await PostModel.findById(postId).populate("authorId");

  const result = await PostModel.findById(postId)
    .populate({
      path: "authorId",
      select: "_id name profilePhoto",
    })
    .populate({
      path: "comments",
      populate: {
        path: "commentatorId",
        select: "_id name profilePhoto",
      },
    });

  return result;
};

// get all post
const getAllPosts = async (query: Record<string, unknown>) => {
  // Initialize query builder and chain methods for search, filtering, sorting, field selection, and pagination
  const postsQuery = new QueryBuilder(
    PostModel.find({ isDeleted: false }),
    query
  )
    .search(["title", "description", "category"])
    .filter()
    .sort()
    .fields()
    // .paginate()
    .build();

  // Populate nested fields for comments and author information
  const result = await postsQuery.populate([
    {
      path: "comments",
      populate: {
        path: "commentatorId",
        select: "_id name profilePhoto",
      },
    },
    {
      path: "authorId",
      select: "_id name profilePhoto",
    },
  ]);

  return result;
};

// delete a single post
const deleteAPost = async (postId: string): Promise<TPost | null> => {
  if (!postId) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid post ID");
  }

  const result = await PostModel.findByIdAndUpdate(
    postId,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

// update a post
const updateAPost = async (
  postId: string,
  updatedInfo: Partial<TPost>
): Promise<TPost | null> => {
  try {
    const result = await PostModel.findByIdAndUpdate(
      postId,
      { $set: updatedInfo },
      { new: true } // Return the updated post after the update
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }

    return result;
  } catch (error) {
    console.error("Error updating post data:", error);
    throw new AppError(httpStatus.BAD_REQUEST, "Unable to update post data");
  }
};

// get my post
const getMyPosts = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email } = decoded;

  // get user
  const user = await User.findOne({ email });

  const result = await PostModel.find({ authorId: user?._id })
    .populate("authorId")
    .sort({ createdAt: -1 });

  return result;
};

// add a comment
const addAComment = async (postId: string, commentData: TComment) => {
  const commentObj = {
    comment: commentData?.comment,
    commentatorId: commentData?.commentatorId,
    isDeleted: false,
  };
  const result = await PostModel.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: commentObj,
      },
    },
    { new: true }
  );
  return result;
};

// delete a comment
const deleteAComment = async (
  postId: string,
  commentId: string
): Promise<TPost | null> => {
  const post = await PostModel.findById(postId);
  if (!post) throw new AppError(httpStatus.NOT_FOUND, "Post not found");

  // Check if the comment exists and set isDeleted
  const comment = post.comments?.find(
    (com) => com._id?.toString() === commentId
  );
  if (!comment) throw new AppError(httpStatus.NOT_FOUND, "Comment not founs");

  comment.isDeleted = true;

  // Save changes and return updated post
  return await post.save();
};

// update comments
const updateAComment = async (
  postId: string,
  commentId: string,
  updatedInfo: Partial<TComment>
): Promise<TPost | null> => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) throw new AppError(httpStatus.NOT_FOUND, "Post not found");

    const comment = post.comments?.find(
      (com) => com._id?.toString() === commentId
    );
    if (!comment) throw new AppError(httpStatus.NOT_FOUND, "Comment not founs");

    Object.assign(comment, updatedInfo);

    return await post.save();
  } catch (error) {
    console.error("Error updating post data:", error);
    throw new AppError(httpStatus.BAD_REQUEST, "Unable to update post data");
  }
};

// manage upVote Downvote
const upVoteDownVote = async (
  postId: string,
  userId: string,
  voteType: string
): Promise<TPost | null> => {
  const post = await PostModel.findById(postId);
  if (!post) return null;

  const userObjectId = new Types.ObjectId(userId);
  const hasAlreadyUpvoted = post.upVoterList.includes(userObjectId);
  const hasAlreadyDownvoted = post.downVoterList.includes(userObjectId);

  const updateVote = (type: string, increment: boolean) => {
    if (type === "upvote") {
      post.upVoteNumber += increment ? 1 : -1;
      if (increment) {
        post.upVoterList.push(userObjectId);
        if (hasAlreadyDownvoted) {
          post.downVoteNumber--;
          post.downVoterList = post.downVoterList.filter(
            (id) => id.toString() !== userId
          );
        }
      } else {
        post.upVoterList = post.upVoterList.filter(
          (id) => id.toString() !== userId
        );
      }
    } else if (type === "downvote") {
      post.downVoteNumber += increment ? 1 : -1;
      if (increment) {
        post.downVoterList.push(userObjectId);
        if (hasAlreadyUpvoted) {
          post.upVoteNumber--;
          post.upVoterList = post.upVoterList.filter(
            (id) => id.toString() !== userId
          );
        }
      } else {
        post.downVoterList = post.downVoterList.filter(
          (id) => id.toString() !== userId
        );
      }
    }
  };

  if (voteType === "upvote") {
    updateVote("upvote", !hasAlreadyUpvoted);
  } else if (voteType === "downvote") {
    updateVote("downvote", !hasAlreadyDownvoted);
  }
  const result = await post.save();

  return result;
};

export const PostServices = {
  createPost,
  getAllPosts,
  getSinglePost,
  deleteAPost,
  updateAPost,
  getMyPosts,
  addAComment,
  deleteAComment,
  updateAComment,
  upVoteDownVote,
};
