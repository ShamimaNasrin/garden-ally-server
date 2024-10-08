import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";

// auth user middleware
export const authUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("authorization")?.replace("Bearer ", "");

  // checking if the token is missing
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }
  // check token is valid or not
  try {
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
    (req as any).userId = decoded.sub;
    (req as any).userRole = decoded.role;
    next();
  } catch (err) {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Invalid token",
      error: err,
    });
  }
};

// auth admin middleware
export const authAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any)?.userRole !== "admin") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Access denied");
  } else {
    next();
  }
};
