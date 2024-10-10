/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { PostModel } from "../post/post.model";

// create User function
const createUser = async (userData: Partial<TUser>) => {
  const role = userData.role || "user";
  const result = await User.create({ ...userData, role });

  return result;
};

// get a single User
const getSingleUser = async (userId: string) => {
  if (!userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid user ID");
  }

  const result = await User.findById(userId)
    .populate("followers")
    .populate("following");
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

  // Fetch users with the role "user" whose _id is not in the user's followings array
  const unfollowedUsers = await User.find({
    role: "user",
    _id: { $nin: user.followings || [] }, // Exclude users already in the followings array
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

    return updatedUser;
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

export const UserServices = {
  createUser,
  getAllUsers,
  fetchUnfollowedUsers,
  getSingleUser,
  updateUserProfile,
  addFollow,
  addFavoritePost,
  getAllFavoritePosts,
  removeFavoritePost,
};
