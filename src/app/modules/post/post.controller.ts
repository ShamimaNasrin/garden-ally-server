import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";
import AppError from "../../errors/AppError";

// create a new post
const createPost = catchAsync(async (req, res) => {
  // console.log("createPost:", req.body);
  const result = await PostServices.createPost(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post created successfully",
    data: result,
  });
});

// get all posts
const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPosts(req.query);

  if (!result?.length) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Posts retrieved successfully",
      data: result,
    });
  }
});

// get a single post
const getSinglePost = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const result = await PostServices.getSinglePost(postId);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Post Found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post retrieved successfully",
      data: result,
    });
  }
});

// delete a single post
const deleteAPost = catchAsync(async (req, res) => {
  const postId = req.params.postId;

  const result = await PostServices.deleteAPost(postId);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Post Found",
      data: [],
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post deleted successfully",
    data: result,
  });
});

// update post
const updateAPost = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const updatedInfo = req.body;

  const result = await PostServices.updateAPost(postId, updatedInfo);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Post not found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  }
});

// fetch my posts
const getMyPosts = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const result = await PostServices.getMyPosts(userId);

  if (!result?.length) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Post Found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Posts retrieved successfully",
      data: result,
    });
  }
});

// add comments
const addAComment = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const result = await PostServices.addAComment(postId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment created successfully",
    data: result,
  });
});

// delete comments
const deleteAComment = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const result = await PostServices.deleteAComment(postId, commentId);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Comment Found",
      data: [],
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result,
  });
});

// update comments
const updateAComment = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const updatedInfo = req.body;

  const result = await PostServices.updateAComment(
    postId,
    commentId,
    updatedInfo
  );

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Comment not found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comment updated successfully",
      data: result,
    });
  }
});

// manage upVote Downvote
const upVoteDownVote = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const userId = String(req.body.userId);
  const voteType = req.body.voteType;

  if (!postId || !userId || !voteType) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid postId or userId or voteType"
    );
  }

  const result = await PostServices.upVoteDownVote(postId, userId, voteType);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Vote not found",
      data: [],
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vote managed successfully",
    data: result,
  });
});

// post Activity Chart
const monthlyPostChart = catchAsync(async (req, res) => {
  // console.log("monthlyPostChart called");
  const result = await PostServices.monthlyPostChart();

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Failed to get post activity",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post activity retrieved successfully",
      data: result,
    });
  }
});

export const PostControllers = {
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
