/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from "console";
import { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Not Found",
    error: error,
  });
};

export default notFound;
