/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { PostModel } from "../post/post.model";
import { createToken } from "../auth/auth.utils";
import config from "../../config";
import { initiatePayment } from "../payments/payment.utils";

// create User function
const createUser = async (userData: Partial<TUser>) => {
  const role = userData.role || "user";
  const result = await User.create({ ...userData, role });

  return result;
};

// get a single User
const getUserByID = async (userId: string) => {
  if (!userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid user ID");
  }

  const result = await User.findById(userId)
    .populate({
      path: "followers",
      select: "_id name profilePhoto",
    })
    .populate({
      path: "followings",
      select: "_id name profilePhoto",
    })
    .populate({
      path: "favouritePosts",
      select: "title _id description images category authorId",
    });

  return result;
};

// get a single User
const getUserByEmail = async (userEmail: string) => {
  if (!userEmail) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid user email");
  }

  // Use findOne to search for the user by email
  const result = await User.findOne({ email: userEmail })
    .populate("followers")
    .populate("following");

  // Check if a user was found
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return result;
};

// get all Users
const getAllUsers = async () => {
  const result = await User.find({ isDeleted: false });
  return result;
};

const fetchUnfollowedUsers = async (userId: string) => {
  // Fetch the user's followings array
  const user = await User.findById(userId).select("followings");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Fetch users with the role "user" who are not followed by the user, not deleted, and not the user themselves
  const unfollowedUsers = await User.find({
    role: "user",
    isDeleted: false,
    _id: { $nin: [userId, ...(user.followings || [])] },
  });

  return unfollowedUsers;
};

// update a single User Role
const updateUserProfile = async (
  userId: string,
  updatedInfo: Partial<TUser>
) => {
  try {
    // console.log("Updating user :", userId, updatedInfo);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedInfo,
      { new: true } // Return the updated user after the update
    );

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const jwtPayload = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role,
      profilePhoto: updatedUser.profilePhoto,
      favouritePosts: updatedUser.favouritePosts,
      isVerified: updatedUser.isVerified,
      followers: updatedUser.followers,
      followings: updatedUser.followings,
      isDeleted: updatedUser.isDeleted,
    };

    // Generate new access tokens
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    return {
      updatedUser,
      accessToken,
    };
  } catch (error) {
    console.error("Error updating user data:", error);
    throw new AppError(httpStatus.BAD_REQUEST, "Unable to update user data");
  }
};

// add Follow
const addFollow = async (userId: string, followId: string) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    // Add followId to user1's followings array
    const user1Update = User.findByIdAndUpdate(
      userId,
      { $addToSet: { followings: followId } },
      { new: true, session }
    );

    // Add userId to user2's followers array
    const user2Update = User.findByIdAndUpdate(
      followId,
      { $addToSet: { followers: userId } },
      { new: true, session }
    );

    // Run both updates concurrently
    const [updatedUser1, updatedUser2] = await Promise.all([
      user1Update,
      user2Update,
    ]);

    await session.commitTransaction();
    session.endSession();

    return updatedUser1;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Something went wrong while updating following list"
    );
  }
};

// unfollow
const unFollow = async (userId: string, followingId: string) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    // Remove followingId from user1's followings array
    const user1Update = User.findByIdAndUpdate(
      userId,
      { $pull: { followings: followingId } },
      { new: true, session }
    );

    // Remove userId from user2's followers array
    const user2Update = User.findByIdAndUpdate(
      followingId,
      { $pull: { followers: userId } },
      { new: true, session }
    );

    // Run both updates concurrently
    const [updatedUser1, updatedUser2] = await Promise.all([
      user1Update,
      user2Update,
    ]);

    await session.commitTransaction();
    session.endSession();

    return updatedUser1;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Something went wrong while updating following list"
    );
  }
};

// add favorite post
const addFavoritePost = async (userId: string, postId: string) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favouritePosts: postId } },
    { new: true }
  );

  return result;
};

// get favorite posts
const getAllFavoritePosts = async (userId: string) => {
  const user = await User.findById(userId).select("favouritePosts");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await PostModel.find({ _id: { $in: user.favouritePosts } });

  return result;
};

// remove favorite posts
const removeFavoritePost = async (userId: string, postId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favouritePosts: postId } },
    { new: true }
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// Payment methods
const paymentToPremium = async (userId: string) => {
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("No user found");
  }

  const postWithVotes = await PostModel.findOne({
    authorId: userId,
    upVoteNumber: { $gte: 1 },
  });

  if (!postWithVotes) {
    throw new Error("To verify your account you need at least 1 upvote");
  }

  const transactionId = `TXN-${Date.now()}-${userId}`;

  const totalPrice = "10";

  const paymentData = {
    transactionId,
    totalPrice,
    custormerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
    customerAddress: user.address,
  };

  //payment
  const paymentSession = await initiatePayment(paymentData);

  // console.log(paymentSession);

  return paymentSession;
};

export const UserServices = {
  createUser,
  getAllUsers,
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
};
