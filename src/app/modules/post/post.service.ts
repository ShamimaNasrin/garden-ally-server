/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { PostModel } from "../post/post.model";
import { TComment, TPost, TPostWithDates } from "./post.interface";
import QueryBuilder from "../../builder/QueryBuilder";
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

  // Manually filter out deleted comments
  if (result && result.comments && result?.comments?.length) {
    result.comments = result.comments.filter((comment) => !comment.isDeleted);
  }

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

  result.forEach((post) => {
    if (post?.comments && post?.comments?.length) {
      post.comments = post.comments.filter((comment) => !comment.isDeleted);
    }
  });

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
const getMyPosts = async (userId: string) => {
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID provided");
  }

  // Find posts by the given user ID
  const result = await PostModel.find({ authorId: userId, isDeleted: false })
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
    })
    .sort({ createdAt: -1 });

  result.forEach((post) => {
    if (post?.comments && post?.comments?.length) {
      post.comments = post.comments.filter((comment) => !comment.isDeleted);
    }
  });

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

// post Activity Chart
const monthlyPostChart = async () => {
  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Fetch all posts created in the current month
  // const posts = await PostModel.find({
  //   isDeleted: false,
  //   createdAt: {
  //     $gte: startOfMonth,
  //     $lt: endOfMonth,
  //   },
  // }).lean();

  const posts = (await PostModel.find({
    isDeleted: false,
    createdAt: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  }).lean()) as unknown as TPostWithDates[];

  // Initialize an array to store post counts for each day of the current month
  const daysInMonth = endOfMonth.getDate();
  const postChartData = Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    const month = currentDate.toLocaleString("default", { month: "short" });
    return {
      day: `${day} ${month}`, // Format as "DD Mon"
      postCount: 0,
    };
  });

  // Calculate the post count for each day of the current month
  posts.forEach((post) => {
    const postDay = new Date(post.createdAt).getDate();
    postChartData[postDay - 1].postCount += 1;
  });

  return postChartData;
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
  monthlyPostChart,
};
