import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";

// user Login
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { user, accessToken, refreshToken } = result;

  // set the refresh token to cookie
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in succesfully!",
    data: {
      user,
      accessToken,
    },
  });
});

// refreshToken
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved succesfully!",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userEmail = req.body.email;
  // console.log("forgetPassword:", userEmail);

  if (!userEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid email address");
  }

  const result = await AuthServices.forgetPassword(userEmail);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset link is generated succesfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.header("authorization")?.replace("Bearer ", "");
  // const token = req.headers.authorization;

  // const { userEmail, newPassword } = req.body;

  // console.log("resetPassword:", userId, newPassword, token);

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "No token provided");
  }
  // const result = await resetPasswordService({ userEmail, newPassword }, token);
  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset succesfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const token = req.header("authorization")?.replace("Bearer ", "");
  // const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid token !");
  }

  const result = await AuthServices.changePassword(token, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password is updated succesfully!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
};
