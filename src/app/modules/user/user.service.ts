/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";

// create User function
const createUser = async (userData: any) => {
  const role = userData.role || "user";
  const result = await User.create({ ...userData, role });

  return {
    _id: result._id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    address: result.address,
    role: result.role,
  };
};

// get a single User

// get all Users
const getAllUsers = async () => {
  try {
    const users = await User.find({ isDeleted: false });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new AppError(httpStatus.BAD_REQUEST, "Unable to fetch users");
  }
};

// delete a User

// update a single User Role

const updateUserRole = async (userId: string, newRole: string) => {
  try {
    console.log("Updating user role:", userId, newRole);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole }, // Update the role field
      { new: true } // Return the updated user after the update
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new AppError(httpStatus.BAD_REQUEST, "Unable to update user role");
  }
};

export const UserServices = { createUser, getAllUsers, updateUserRole };
