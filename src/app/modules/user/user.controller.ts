import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

// create a new user
const signUp = catchAsync(async (req, res) => {
  const result = await UserServices.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

// get all users
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsers();

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
      message: "Users retrieved successfully",
      data: result,
    });
  }
});

// get all user for following suggestion
const fetchUnfollowedUsers = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserServices.fetchUnfollowedUsers(userId);

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
      message: "Follow suggesions retrieved successfully",
      data: result,
    });
  }
});

// get a single user
const getSingleUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserServices.getSingleUser(userId);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No User Found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  }
});

// update user a user's role
const updateUserProfile = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const updatedInfo = req.body;

  const result = await UserServices.updateUserProfile(userId, updatedInfo);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "User not found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  }
});

// add follow
const addFollow = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const followId = req.body.followId;
  const result = await UserServices.addFollow(userId, followId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Follow successfull",
    data: result,
  });
});

// add favorite post
const addFavoritePost = catchAsync(async (req, res) => {
  const userId = req.body.userId;
  const postId = req.params.postId;

  const result = await UserServices.addFavoritePost(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post successfully added to favorites",
    data: result,
  });
});

// get favorite posts
const getAllFavoritePosts = catchAsync(async (req, res) => {
  const userId = req.body.userId;
  const result = await UserServices.getAllFavoritePosts(userId);

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
      message: "Users retrieved successfully",
      data: result,
    });
  }
});

// remove favorite posts
const removeFavoritePost = catchAsync(async (req, res) => {
  const userId = req.body.userId;
  const postId = req.params.postId;
  const result = await UserServices.removeFavoritePost(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

export const UserControllers = {
  signUp,
  getAllUsers,
  fetchUnfollowedUsers,
  getSingleUser,
  updateUserProfile,
  addFollow,
  addFavoritePost,
  getAllFavoritePosts,
  removeFavoritePost,
};
