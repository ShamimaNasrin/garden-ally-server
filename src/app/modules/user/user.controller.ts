import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";

// create a new user
const signUp = catchAsync(async (req, res) => {
  // console.log("signUp:", req.body);
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
  const adminId = req.params.adminId;
  const result = await UserServices.getAllUsers(adminId);

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

// update a user's role
const updateUserRole = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const updatedInfo = req.body;

  const result = await UserServices.updateUserRole(userId, updatedInfo.role);

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
const getUserByID = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  // console.log("userId: " + userId);
  const result = await UserServices.getUserByID(userId);

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

const getUserByEmail = catchAsync(async (req, res) => {
  const userEmail = req.params.userEmail;

  if (!userEmail) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid user email");
  }

  // console.log("getUserByEmail:", userEmail);
  const result = await UserServices.getUserByEmail(userEmail);

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

// update user
const updateUserProfile = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const updatedInfo = req.body;

  // console.log("updateUserProfile:", userId, updatedInfo);

  const result = await UserServices.updateUserProfile(userId, updatedInfo);
  const { updatedUser, accessToken } = result;

  // console.log("updateUserProfile:", result);

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
      data: {
        updatedUser,
        accessToken,
      },
    });
  }
});

// add follow
const addFollow = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const followId = req.body.followId;

  // console.log("userId: " + userId);
  // console.log("followId: " + followId);

  const result = await UserServices.addFollow(userId, followId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Follow successfull",
    data: result,
  });
});

// unfollow
const unFollow = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const followingId = req.body.followingId;

  // console.log("userId: " + userId);
  // console.log("followingId: " + followingId);

  const result = await UserServices.unFollow(userId, followingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User unFollow successfull",
    data: result,
  });
});

// add favorite post
const addFavoritePost = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const postId = req.body.postId;

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
  const userId = req.params.userId;
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
      message: "Posts retrieved successfully",
      data: result,
    });
  }
});

// remove favorite posts
const removeFavoritePost = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const postId = req.body.postId;
  const result = await UserServices.removeFavoritePost(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Removed post successfully",
    data: result,
  });
});

// Payment methods
const paymentToPremium = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  // console.log("payment userId:", userId);

  const result = await UserServices.paymentToPremium(userId);

  // console.log("payment result:", result);

  if (!result?.result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Payment failed",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment successful",
      data: result,
    });
  }
});

// user Activity Chart
const userActivityChart = catchAsync(async (req, res) => {
  // console.log("userActivityChart called");
  const result = await UserServices.userActivityChart();

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Failed to get user activity",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User activity retrieved successfully",
      data: result,
    });
  }
});

export const UserControllers = {
  signUp,
  getAllUsers,
  updateUserRole,
  fetchUnfollowedUsers,
  getUserByID,
  getUserByEmail,
  updateUserProfile,
  addFollow,
  unFollow,
  addFavoritePost,
  getAllFavoritePosts,
  removeFavoritePost,
  paymentToPremium,
  userActivityChart,
};
