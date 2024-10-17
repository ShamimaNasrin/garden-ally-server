import { Model, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

// User Interface
export interface TUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "user" | "admin";
  imageUrl: string;
  favouritePosts?: Types.ObjectId[];
  isVerified?: boolean;
  followers?: Types.ObjectId[];
  followings?: Types.ObjectId[];
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByEmail(email: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
